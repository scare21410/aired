variable "environments" {
  type = map(object({
    name  = string
    email = string
  }))
  default = {
    shared = {
      name  = "shared"
      email = "martin.komara+aired-shared@gmail.com"
    }
    staging = {
      name  = "staging"
      email = "martin.komara+aired-staging@gmail.com"
    }
    production = {
      name  = "production"
      email = "martin.komara+aired-production@gmail.com"
    }
  }
  description = "A map of environment accounts to create with their configuration."
}

variable "users" {
  type = map(object({
    given_name          = string
    family_name         = string
    email               = string
    phone               = optional(string)
    group_associations  = list(string)
    billing             = optional(bool, false)
    operations          = optional(bool, false)
    security            = optional(bool, false)
  }))
  default = {
    admin = {
      given_name         = "Martin"
      family_name        = "Komara"
      email              = "martin.komara+aired-admin@gmail.com"
      phone              = "+421917718607"
      group_associations = ["admin"]
      billing            = true
      operations         = true
      security           = true
    }
  }
  description = "A map of IAM Identity Center users to create with their configuration."
}