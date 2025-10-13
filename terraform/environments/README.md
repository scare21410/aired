# Setting up environments

## Bootstrapping

1. Make sure the `terraform_remote_state` and `backend` are commented out
   before the bootstrap process starts.

2. Run terraform to create s3 buckets
   ```bash
   cd terraform/environments/bootstrap
   terraform init
   terraform plan
   terraform apply
   ```

3. Migrate terraform state to s3 bucket in the shared account:
    1. In `terraform/environments/bootstrap/provider.ts` uncomment `terraform_remote_state` and `backend`
    2. Migrate state using `terraform init -migrate-state`
 
4. Test that the infrastructure is up to date by running `terraform plan`
