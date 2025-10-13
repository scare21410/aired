locals {
  namespace = "aired"
  region    = "us-east-1"

  tags = {
    "${local.namespace}:project"        = "organization"
    "${local.namespace}:region"         = local.region
    "${local.namespace}:terraform"      = "true"
    "${local.namespace}:terraform-path" = "organization/accounts"
  }
}
