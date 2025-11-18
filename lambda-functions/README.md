# Lambda Functions for DynamoDB Backend

This directory contains AWS Lambda functions to handle API requests and interact with DynamoDB.

## Functions

### 1. getRecordingLogs.js
Fetches recording logs from DynamoDB based on date range.

**Environment Variables:**
- `TABLE_NAME`: DynamoDB table name (default: RecordingLogs)
- `AWS_REGION`: AWS region (automatically set by Lambda)

**API Gateway Integration:**
- Method: GET
- Path: `/api/recording-log`
- Query Parameters: `startDate` and `endDate` (date strings)

### 2. requeueRecording.js
Updates a recording's status to requeue it for processing.

**Environment Variables:**
- `TABLE_NAME`: DynamoDB table name (default: RecordingLogs)
- `AWS_REGION`: AWS region (automatically set by Lambda)

**API Gateway Integration:**
- Method: POST
- Path: `/api/recording`
- Body: `{ "taskId": "task-12345" }`

## Deployment

### Option 1: AWS Console

1. Go to AWS Lambda console
2. Create a new function for each file
3. Copy the code into the function
4. Set environment variables
5. Create API Gateway endpoints and connect them to the Lambda functions
6. Enable CORS on API Gateway

### Option 2: AWS SAM (Serverless Application Model)

Create `template.yaml` in this directory and deploy using AWS SAM CLI.

### Option 3: Terraform/CloudFormation

Use Infrastructure as Code to deploy Lambda functions, API Gateway, and DynamoDB table.

## IAM Role Permissions

The Lambda execution role needs:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/RecordingLogs",
        "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/RecordingLogs/index/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

## Testing Locally

Install dependencies:
```bash
npm install
```

Use AWS SAM CLI or LocalStack to test Lambda functions locally before deployment.

## Package for Deployment

If deploying manually, package the functions with dependencies:

```bash
cd lambda-functions
npm install
zip -r getRecordingLogs.zip getRecordingLogs.js node_modules/
zip -r requeueRecording.zip requeueRecording.js node_modules/
```

Then upload the ZIP files to AWS Lambda.
