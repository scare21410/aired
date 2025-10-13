data "terraform_remote_state" "bootstrap" {
  backend = "s3"

  config = {
    key          = "bootstrap/terraform.tfstate"
    encrypt      = true
    use_lockfile = true
    bucket       = "aired-shared-terraform-state"
    region       = "us-east-1"
    profile      = "aired-shared"
  }
}

terraform {
  backend "s3" {
    key          = "bootstrap/terraform.tfstate"
    encrypt      = true
    use_lockfile = true
    bucket       = "aired-shared-terraform-state"
    region       = "us-east-1"
    profile      = "aired-shared"
  }
}

provider "aws" {
  region  = local.region
  profile = "${local.namespace}-shared"
}