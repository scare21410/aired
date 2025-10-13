data "terraform_remote_state" "accounts" {
  backend = "s3"

  config = {
    key          = "accounts/terraform.tfstate"
    encrypt      = true
    use_lockfile = true
    bucket       = "aired-organization-terraform-state"
    region       = "us-east-1"
    profile      = "aired"
  }
}

terraform {
  backend "s3" {
    key          = "accounts/terraform.tfstate"
    encrypt      = true
    use_lockfile = true
    bucket       = "aired-organization-terraform-state"
    region       = "us-east-1"
    profile      = "aired"
  }
}

provider "aws" {
  region  = local.region
  profile = local.namespace
}