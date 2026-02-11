provider "aws" {
  region = var.aws_region
}

data "aws_availability_zones" "available" {}

data "aws_caller_identity" "current" {}

locals {
  name = "${var.project_name}-${var.environment}"
  public_azs = slice(data.aws_availability_zones.available.names, 0, 2)
}

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = {
    Name = local.name
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = local.name
  }
}

resource "aws_subnet" "public" {
  count = length(var.public_subnet_cidrs)
  vpc_id = aws_vpc.main.id
  cidr_block = var.public_subnet_cidrs[count.index]
  availability_zone = local.public_azs[count.index]
  map_public_ip_on_launch = true
  tags = {
    Name = "${local.name}-public-${count.index + 1}"
  }
}

resource "aws_subnet" "private" {
  count = length(var.private_subnet_cidrs)
  vpc_id = aws_vpc.main.id
  cidr_block = var.private_subnet_cidrs[count.index]
  availability_zone = local.public_azs[count.index]
  tags = {
    Name = "${local.name}-private-${count.index + 1}"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  tags = {
    Name = "${local.name}-public"
  }
}

resource "aws_route_table_association" "public" {
  count = length(aws_subnet.public)
  subnet_id = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "alb" {
  name = "${local.name}-alb"
  vpc_id = aws_vpc.main.id
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ecs" {
  name = "${local.name}-ecs"
  vpc_id = aws_vpc.main.id
  ingress {
    from_port = var.app_port
    to_port = var.app_port
    protocol = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "rds" {
  name = "${local.name}-rds"
  vpc_id = aws_vpc.main.id
  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_subnet_group" "main" {
  name = "${local.name}-db"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_db_instance" "main" {
  identifier = "${local.name}-db"
  engine = "postgres"
  instance_class = "db.t4g.micro"
  allocated_storage = 20
  db_name = var.db_name
  username = var.db_username
  password = var.db_password
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name = aws_db_subnet_group.main.name
  publicly_accessible = false
  multi_az = true
  skip_final_snapshot = true
}

resource "aws_secretsmanager_secret" "database" {
  name = "${local.name}-database-url"
}

resource "aws_secretsmanager_secret_version" "database" {
  secret_id = aws_secretsmanager_secret.database.id
  secret_string = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/${var.db_name}"
}

resource "aws_secretsmanager_secret" "cloudfront_private_key" {
  name = "${local.name}-cloudfront-private-key"
}

resource "aws_secretsmanager_secret_version" "cloudfront_private_key" {
  secret_id = aws_secretsmanager_secret.cloudfront_private_key.id
  secret_string = var.cloudfront_private_key
}

resource "aws_ecr_repository" "api" {
  name = "${local.name}-api"
}

resource "aws_ecr_repository" "web" {
  name = "${local.name}-web"
}

resource "aws_ecs_cluster" "main" {
  name = "${local.name}-cluster"
}

resource "aws_iam_role" "ecs_execution" {
  name = "${local.name}-ecs-exec"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = { Service = "ecs-tasks.amazonaws.com" },
        Action = "sts:AssumeRole",
      },
    ],
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_execution_secrets" {
  name = "${local.name}-ecs-exec-secrets"
  role = aws_iam_role.ecs_execution.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = ["secretsmanager:GetSecretValue"],
        Resource = [
          aws_secretsmanager_secret.database.arn,
          aws_secretsmanager_secret.cloudfront_private_key.arn
        ],
      },
    ],
  })
}

resource "aws_iam_role" "ecs_task" {
  name = "${local.name}-ecs-task"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = { Service = "ecs-tasks.amazonaws.com" },
        Action = "sts:AssumeRole",
      },
    ],
  })
}

resource "aws_iam_role_policy" "ecs_task_s3" {
  name = "${local.name}-ecs-task-s3"
  role = aws_iam_role.ecs_task.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = ["s3:PutObject", "s3:GetObject", "s3:ListBucket"],
        Resource = [aws_s3_bucket.media.arn, "${aws_s3_bucket.media.arn}/*"],
      },
    ],
  })
}

resource "aws_cloudwatch_log_group" "api" {
  name = "/ecs/${local.name}"
  retention_in_days = 30
}

resource "aws_ecs_task_definition" "api" {
  family = "${local.name}-api"
  network_mode = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu = 256
  memory = 512
  execution_role_arn = aws_iam_role.ecs_execution.arn
  task_role_arn = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name = "api",
      image = var.app_image,
      essential = true,
      portMappings = [
        {
          containerPort = var.app_port,
          hostPort = var.app_port,
          protocol = "tcp"
        }
      ],
      environment = [
        { name = "PORT", value = tostring(var.app_port) },
        { name = "AWS_REGION", value = var.aws_region },
        { name = "S3_BUCKET", value = aws_s3_bucket.media.bucket },
        { name = "DATABASE_SSL", value = "true" },
        { name = "COGNITO_USER_POOL_ID", value = aws_cognito_user_pool.main.id },
        { name = "COGNITO_CLIENT_ID", value = aws_cognito_user_pool_client.main.id },
        { name = "CLOUDFRONT_DOMAIN", value = aws_cloudfront_distribution.media.domain_name },
        { name = "CLOUDFRONT_KEY_ID", value = aws_cloudfront_public_key.media.id }
      ],
      secrets = [
        { name = "DATABASE_URL", valueFrom = aws_secretsmanager_secret.database.arn },
        { name = "CLOUDFRONT_PRIVATE_KEY", valueFrom = aws_secretsmanager_secret.cloudfront_private_key.arn }
      ],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-group = aws_cloudwatch_log_group.api.name,
          awslogs-region = var.aws_region,
          awslogs-stream-prefix = "api"
        }
      }
    }
  ])
}

resource "aws_ecs_task_definition" "api_migrate" {
  family = "${local.name}-api-migrate"
  network_mode = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu = 256
  memory = 512
  execution_role_arn = aws_iam_role.ecs_execution.arn
  task_role_arn = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name = "api-migrate",
      image = var.app_image,
      essential = true,
      command = ["/app/node_modules/.bin/drizzle-kit", "migrate"],
      environment = [
        { name = "AWS_REGION", value = var.aws_region },
        { name = "S3_BUCKET", value = aws_s3_bucket.media.bucket },
        { name = "DATABASE_SSL", value = "true" },
        { name = "COGNITO_USER_POOL_ID", value = aws_cognito_user_pool.main.id },
        { name = "COGNITO_CLIENT_ID", value = aws_cognito_user_pool_client.main.id },
        { name = "CLOUDFRONT_DOMAIN", value = aws_cloudfront_distribution.media.domain_name },
        { name = "CLOUDFRONT_KEY_ID", value = aws_cloudfront_public_key.media.id }
      ],
      secrets = [
        { name = "DATABASE_URL", valueFrom = aws_secretsmanager_secret.database.arn },
        { name = "CLOUDFRONT_PRIVATE_KEY", valueFrom = aws_secretsmanager_secret.cloudfront_private_key.arn }
      ],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-group = aws_cloudwatch_log_group.api.name,
          awslogs-region = var.aws_region,
          awslogs-stream-prefix = "migrate"
        }
      }
    }
  ])
}

resource "aws_ecs_task_definition" "web" {
  family = "${local.name}-web"
  network_mode = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu = 256
  memory = 512
  execution_role_arn = aws_iam_role.ecs_execution.arn
  task_role_arn = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name = "web",
      image = var.web_image,
      essential = true,
      portMappings = [
        {
          containerPort = 3000,
          hostPort = 3000,
          protocol = "tcp"
        }
      ],
      environment = [
        { name = "PORT", value = "3000" },
        { name = "NEXT_PUBLIC_API_BASE_URL", value = "http://${aws_lb.main.dns_name}" },
        { name = "API_BASE_URL", value = "http://${aws_lb.main.dns_name}" }
      ],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-group = aws_cloudwatch_log_group.api.name,
          awslogs-region = var.aws_region,
          awslogs-stream-prefix = "web"
        }
      }
    }
  ])
}

resource "aws_lb" "main" {
  name = "${local.name}-alb"
  load_balancer_type = "application"
  subnets = aws_subnet.public[*].id
  security_groups = [aws_security_group.alb.id]
}

resource "aws_lb_target_group" "api" {
  name = "${local.name}-tg"
  port = var.app_port
  protocol = "HTTP"
  vpc_id = aws_vpc.main.id
  target_type = "ip"
  health_check {
    path = "/api/health"
    matcher = "200"
  }
}

resource "aws_lb_target_group" "web" {
  name = "${local.name}-web-tg"
  port = 3000
  protocol = "HTTP"
  vpc_id = aws_vpc.main.id
  target_type = "ip"
  health_check {
    path = "/"
    matcher = "200-399"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port = 80
  protocol = "HTTP"
  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}

resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.http.arn
  priority = 10
  action {
    type = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }
  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

resource "aws_ecs_service" "api" {
  name = "${local.name}-api"
  cluster = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count = var.desired_count
  launch_type = "FARGATE"
  network_configuration {
    subnets = aws_subnet.public[*].id
    security_groups = [aws_security_group.ecs.id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name = "api"
    container_port = var.app_port
  }
  depends_on = [aws_lb_listener.http]
}

resource "aws_ecs_service" "web" {
  name = "${local.name}-web"
  cluster = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.web.arn
  desired_count = var.web_desired_count
  launch_type = "FARGATE"
  network_configuration {
    subnets = aws_subnet.public[*].id
    security_groups = [aws_security_group.ecs.id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.web.arn
    container_name = "web"
    container_port = 3000
  }
  depends_on = [aws_lb_listener.http]
}
resource "aws_s3_bucket" "media" {
  bucket = "${local.name}-${data.aws_caller_identity.current.account_id}-media"
}

resource "aws_s3_bucket_public_access_block" "media" {
  bucket = aws_s3_bucket.media.id
  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "media" {
  bucket = aws_s3_bucket.media.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_cloudfront_origin_access_control" "media" {
  name = "${local.name}-media-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

resource "aws_cloudfront_distribution" "media" {
  enabled = true
  default_root_object = ""

  origin {
    domain_name = aws_s3_bucket.media.bucket_regional_domain_name
    origin_id = "media"
    origin_access_control_id = aws_cloudfront_origin_access_control.media.id
  }

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = "media"
    viewer_protocol_policy = "redirect-to-https"
    trusted_key_groups = [aws_cloudfront_key_group.media.id]
    cache_policy_id = data.aws_cloudfront_cache_policy.caching_optimized.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "aws_s3_bucket_policy" "media" {
  bucket = aws_s3_bucket.media.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = { Service = "cloudfront.amazonaws.com" },
        Action = ["s3:GetObject"],
        Resource = "${aws_s3_bucket.media.arn}/*",
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.media.arn
          }
        }
      }
    ]
  })
}

resource "aws_cloudfront_public_key" "media" {
  name = "${local.name}-media-key"
  encoded_key = var.cloudfront_public_key
}

resource "aws_cloudfront_key_group" "media" {
  name = "${local.name}-media-key-group"
  items = [aws_cloudfront_public_key.media.id]
}

resource "aws_cognito_user_pool" "main" {
  name = "${local.name}-user-pool"
  auto_verified_attributes = ["email"]
  username_attributes = ["email"]
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
  }
  password_policy {
    minimum_length = 8
    require_lowercase = true
    require_numbers = true
    require_symbols = false
    require_uppercase = true
  }
}

resource "aws_cognito_user_pool_client" "main" {
  name = "${local.name}-app-client"
  user_pool_id = aws_cognito_user_pool.main.id
  generate_secret = false
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
}
