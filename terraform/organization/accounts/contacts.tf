locals {
  # Create a flat map of account-user-contact_type combinations
  account_contacts = merge([
    for account_key, account in var.environments : {
      for user_key, user in var.users : "${account_key}-${user_key}-billing" => {
        account_id   = aws_organizations_account.accounts[account_key].id
        contact_type = "BILLING"
        name         = "${user.given_name} ${user.family_name}"
        title        = "Billing Contact"
        email        = user.email
        phone_number = user.phone
      } if user.billing && user.phone != null
    }
  ]...)

  operations_contacts = merge([
    for account_key, account in var.environments : {
      for user_key, user in var.users : "${account_key}-${user_key}-operations" => {
        account_id   = aws_organizations_account.accounts[account_key].id
        contact_type = "OPERATIONS"
        name         = "${user.given_name} ${user.family_name}"
        title        = "Operations Contact"
        email        = user.email
        phone_number = user.phone
      } if user.operations && user.phone != null
    }
  ]...)

  security_contacts = merge([
    for account_key, account in var.environments : {
      for user_key, user in var.users : "${account_key}-${user_key}-security" => {
        account_id   = aws_organizations_account.accounts[account_key].id
        contact_type = "SECURITY"
        name         = "${user.given_name} ${user.family_name}"
        title        = "Security Contact"
        email        = user.email
        phone_number = user.phone
      } if user.security && user.phone != null
    }
  ]...)

  all_contacts = merge(
    local.account_contacts,
    local.operations_contacts,
    local.security_contacts
  )
}

resource "aws_account_alternate_contact" "contacts" {
  for_each = local.all_contacts

  account_id             = each.value.account_id
  alternate_contact_type = each.value.contact_type

  name          = each.value.name
  title         = each.value.title
  email_address = each.value.email
  phone_number  = each.value.phone_number

  depends_on = [
    time_sleep.wait_60_seconds_for_account_creation,
    aws_organizations_organization.organization
  ]
}
