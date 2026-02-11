# Deployment Guide

## Terraform (staging/prod)

```bash
cd infra/terraform
terraform init

terraform workspace new staging || terraform workspace select staging
terraform apply -var-file=envs/staging.tfvars

terraform workspace new prod || terraform workspace select prod
terraform apply -var-file=envs/prod.tfvars
```

## GitHub Actions Secrets

Set these per-environment (staging/prod) in GitHub Actions environments:

- `AWS_ROLE_ARN`
- `AWS_REGION`
- `ECR_REPO` (output `ecr_repository_url`)
- `ECS_CLUSTER` (output `ecs_cluster_name`)
- `ECS_SERVICE` (`<project>-<env>-api`, from Terraform)
- `ECS_MIGRATE_TASK_DEF` (output `ecs_migrate_task_definition`)
- `ECS_SUBNETS` (comma-separated subnet IDs from output `private_subnet_ids`)
- `ECS_SECURITY_GROUP` (output `ecs_security_group_id`)

## Migrations

Migrations run via ECS one-off task in the deploy workflow. Ensure you generate migrations before deploying:

```bash
pnpm --filter api db:generate
```

Commit the generated migrations before deploy.
