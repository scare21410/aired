resource "time_sleep" "wait_60_seconds_for_account_creation" {
  depends_on = [aws_organizations_account.accounts]

  create_duration = "60s"
}

resource "aws_s3_bucket" "terraform-state" {
  bucket = "${local.namespace}-organization-terraform-state"
  tags = local.tags
  depends_on = [time_sleep.wait_60_seconds_for_account_creation]
}

resource "aws_s3_bucket_versioning" "terraform-state" {
  bucket = aws_s3_bucket.terraform-state.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform-state" {
  bucket = aws_s3_bucket.terraform-state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
