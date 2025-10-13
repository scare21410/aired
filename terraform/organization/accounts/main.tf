resource "aws_organizations_account" "accounts" {
  for_each = var.environments
  name     = each.value.name
  email    = each.value.email

  tags = local.tags
}