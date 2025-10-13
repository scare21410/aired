locals {
  environment = "shared"
  namespace   = "aired"
  region      = "us-east-1"

  tags = {
    "${local.namespace}:project"        = "bootstrap"
    "${local.namespace}:region"         = local.region
    "${local.namespace}:terraform"      = "true"
    "${local.namespace}:terraform-path" = "environments/bootstrap"
  }
}
