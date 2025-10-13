# Setting up organization

## Bootstrapping

1. Create IAM Identity Center - this will create organization and assign root account. 
   Feel free to manually update start url
2. Create bootstrap user
3. Create BootstrapAdministratorAccess Permission set
4. Assign BootstrapAdministratorAccess to bootstrap user in the root account
5. Update ~/.aws/config to include root profile:
   ```
   [profile aired]
   sso_start_url = https://aired.awsapps.com/start
   sso_region = us-east-1
   sso_account_id = 134219989942 
   sso_role_name = BootstrapAdministratorAccess
   region = us-east-1
   ```
6. Login using sso: `aws sso login --profile aired`

## Create accounts and users

1. Run terraform to create accounts and admin user
   ```bash
   cd terraform/organization/accounts
   terraform init
   terraform plan
   terraform apply
   ```

2. An admin user will be created. Login using root account and reset admin user password. 
   From now on, we will be only using admin user to log in into system.

3. Login using the newly created admin with the password you used when resetting in
   the previous step.

4. Delete the `bootstrap` user and the `BootstrapAdministratorAccess` role.
   We won't need it any longer.

5. Update ~/.aws/config to update the root profile's `sso_role_name` and add account profiles:
   ```
   [profile aired]
   sso_start_url = https://aired.awsapps.com/start
   sso_region = us-east-1
   sso_account_id = 134219989942 
   sso_role_name = AdministratorAccess
   region = us-east-1
   
   [profile aired-shared]
   sso_start_url = https://aired.awsapps.com/start
   sso_region = us-east-1
   sso_account_id = 671842155170 
   sso_role_name = AdministratorAccess
   region = us-east-1
   
   [profile aired-staging]
   sso_start_url = https://aired.awsapps.com/start
   sso_region = us-east-1
   sso_account_id = 624545858655 
   sso_role_name = AdministratorAccess
   region = us-east-1
   
   [profile aired-production]
   sso_start_url = https://aired.awsapps.com/start
   sso_region = us-east-1
   sso_account_id = 426811253663 
   sso_role_name = AdministratorAccess
   region = us-east-1
   ```

6. Migrate terraform state to s3 bucket in the root account:
   1. In `terraform/organization/accounts/provider.ts` uncomment `s3` backend
   2. Migrate state using `terraform init -migrate-state`

7. Test that the infrastructure is up to date by running `terraform plan`





