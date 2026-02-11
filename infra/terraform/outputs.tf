output "alb_dns" {
  value = aws_lb.main.dns_name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.api.repository_url
}

output "web_ecr_repository_url" {
  value = aws_ecr_repository.web.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_web_service_name" {
  value = aws_ecs_service.web.name
}

output "ecs_migrate_task_definition" {
  value = aws_ecs_task_definition.api_migrate.arn
}

output "rds_endpoint" {
  value = aws_db_instance.main.address
}

output "database_secret_arn" {
  value = aws_secretsmanager_secret.database.arn
}

output "s3_bucket" {
  value = aws_s3_bucket.media.bucket
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.media.domain_name
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}

output "ecs_security_group_id" {
  value = aws_security_group.ecs.id
}

output "cloudfront_key_id" {
  value = aws_cloudfront_public_key.media.id
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.main.id
}
