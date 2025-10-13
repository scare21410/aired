data "aws_ssoadmin_instances" "this" {}

resource "aws_identitystore_group" "admin" {
  identity_store_id = tolist(data.aws_ssoadmin_instances.this.identity_store_ids)[0]
  display_name      = "admin"
  description       = "Administrator group with full access to all accounts"
}

resource "aws_identitystore_user" "users" {
  for_each = var.users

  identity_store_id = tolist(data.aws_ssoadmin_instances.this.identity_store_ids)[0]

  display_name = "${each.value.given_name} ${each.value.family_name}"
  user_name    = each.key

  name {
    given_name  = each.value.given_name
    family_name = each.value.family_name
  }

  emails {
    value   = each.value.email
    primary = true
  }
}

locals {
  user_group_memberships = flatten([
    for user_key, user in var.users : [
      for group in user.group_associations : {
        user_key   = user_key
        group_name = group
      }
    ]
  ])
}

resource "aws_identitystore_group_membership" "user_groups" {
  for_each = { for membership in local.user_group_memberships : "${membership.user_key}-${membership.group_name}" => membership }

  identity_store_id = tolist(data.aws_ssoadmin_instances.this.identity_store_ids)[0]
  group_id          = aws_identitystore_group.admin.group_id
  member_id         = aws_identitystore_user.users[each.value.user_key].user_id
}

resource "aws_ssoadmin_permission_set" "administrator_access" {
  name             = "AdministratorAccess"
  description      = "Provides full access to AWS services and resources"
  instance_arn     = tolist(data.aws_ssoadmin_instances.this.arns)[0]
  session_duration = "PT12H"

  depends_on = [time_sleep.wait_60_seconds_for_account_creation]
}

resource "aws_ssoadmin_managed_policy_attachment" "administrator_access" {
  instance_arn       = tolist(data.aws_ssoadmin_instances.this.arns)[0]
  permission_set_arn = aws_ssoadmin_permission_set.administrator_access.arn
  managed_policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

resource "aws_ssoadmin_account_assignment" "admin_group" {
  for_each = var.environments

  instance_arn       = tolist(data.aws_ssoadmin_instances.this.arns)[0]
  permission_set_arn = aws_ssoadmin_permission_set.administrator_access.arn

  principal_type = "GROUP"
  principal_id   = aws_identitystore_group.admin.group_id

  target_type = "AWS_ACCOUNT"
  target_id   = aws_organizations_account.accounts[each.key].id

  depends_on = [time_sleep.wait_60_seconds_for_account_creation]
}

data "aws_caller_identity" "current" {}

resource "aws_ssoadmin_account_assignment" "admin_group_root" {
  instance_arn       = tolist(data.aws_ssoadmin_instances.this.arns)[0]
  permission_set_arn = aws_ssoadmin_permission_set.administrator_access.arn

  principal_type = "GROUP"
  principal_id   = aws_identitystore_group.admin.group_id

  target_type = "AWS_ACCOUNT"
  target_id   = data.aws_caller_identity.current.account_id
}
