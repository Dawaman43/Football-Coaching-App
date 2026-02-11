variable "aws_region" {
  type = string
  default = "eu-north-1"
}

variable "project_name" {
  type = string
  default = "football-coaching"
}

variable "environment" {
  type = string
  default = "prod"
}

variable "vpc_cidr" {
  type = string
  default = "10.20.0.0/16"
}

variable "public_subnet_cidrs" {
  type = list(string)
  default = ["10.20.1.0/24", "10.20.2.0/24"]
}

variable "private_subnet_cidrs" {
  type = list(string)
  default = ["10.20.101.0/24", "10.20.102.0/24"]
}

variable "db_name" {
  type = string
  default = "fitness_coaching"
}

variable "db_username" {
  type = string
  default = "appuser"
}

variable "db_password" {
  type = string
  sensitive = true
}

variable "app_image" {
  type = string
}

variable "app_port" {
  type = number
  default = 3000
}

variable "desired_count" {
  type = number
  default = 1
}

variable "web_image" {
  type = string
}

variable "web_desired_count" {
  type = number
  default = 1
}

variable "cloudfront_public_key" {
  type = string
}

variable "cloudfront_private_key" {
  type = string
  sensitive = true
}
