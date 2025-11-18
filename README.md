# Calabrio Recording Log - React Application

A modern React application for managing and monitoring Calabrio recording logs, converted from a .NET MVC application.

## Features

- 📊 **Data Table with Sorting & Pagination** - View recording logs with advanced filtering
- 🔍 **Date Range Search** - Filter recordings by date range
- 🔄 **Auto-refresh** - Refresh data on demand
- ⚠️ **Error Handling** - View detailed failure information for failed recordings
- 🔁 **Retry Failed Recordings** - Requeue failed items directly from the interface
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Project Structure

```
react-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── RecordingLog.js      # Main recording log component
│   │   ├── RecordingLog.css
│   │   └── FailureModal.js      # Modal for failure details
│   ├── services/
│   │   └── api.js               # API service layer
│   ├── utils/
│   │   └── helpers.js           # Helper functions
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── scripts/                      # AWS deployment scripts
├── .env.example
├── .gitignore
├── appspec.yml                   # AWS CodeDeploy configuration
├── buildspec.yml                 # AWS CodeBuild configuration
├── package.json
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API endpoint (to configure in environment variables)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd "\\DiskStation\Customers\LAC\Current Non Studio\CalabrioWavToMP3Converter Project Code 126\Website\react-app"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and set your API endpoint:
   ```
   REACT_APP_API_BASE_URL=https://your-api-endpoint.com/api
   ```

## Local Development

Run the development server:

```bash
npm start
```

The application will open at `http://localhost:3000`

## Build for Production

Create an optimized production build:

```bash
npm run build
```

This creates a `build/` directory with optimized static files ready for deployment.

## AWS Deployment Options

### Option 1: AWS Amplify (Recommended for Simplicity)

1. **Install AWS Amplify CLI:**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Initialize Amplify in your project:**
   ```bash
   amplify init
   ```

3. **Add hosting:**
   ```bash
   amplify add hosting
   ```
   Choose: **Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)**

4. **Deploy:**
   ```bash
   amplify publish
   ```

### Option 2: AWS S3 + CloudFront

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Create an S3 bucket:**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

3. **Enable static website hosting:**
   ```bash
   aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
   ```

4. **Upload build files:**
   ```bash
   aws s3 sync build/ s3://your-bucket-name --delete
   ```

5. **Set up CloudFront distribution** (optional but recommended):
   - Go to AWS CloudFront console
   - Create a new distribution
   - Set S3 bucket as origin
   - Configure custom domain and SSL certificate

### Option 3: AWS EC2 with CodeDeploy

The project includes `buildspec.yml` and `appspec.yml` for AWS CodePipeline/CodeDeploy:

1. **Set up CodePipeline:**
   - Create a new pipeline in AWS CodePipeline
   - Connect to your source repository (GitHub, CodeCommit, etc.)
   - Add CodeBuild as build provider (uses `buildspec.yml`)
   - Add CodeDeploy as deployment provider (uses `appspec.yml`)

2. **Configure EC2 instances:**
   - Launch EC2 instances with CodeDeploy agent installed
   - Create deployment group in CodeDeploy
   - Tag instances appropriately

3. **Deploy:**
   - Push code to your repository
   - Pipeline automatically builds and deploys

### Option 4: AWS Elastic Beanstalk

1. **Install EB CLI:**
   ```bash
   pip install awsebcli
   ```

2. **Initialize Elastic Beanstalk:**
   ```bash
   eb init -p node.js calabrio-recording-app
   ```

3. **Create environment and deploy:**
   ```bash
   eb create production-env
   eb deploy
   ```

## API Configuration

The application expects the following API endpoints (AWS API Gateway with Lambda/DynamoDB backend):

- `GET /api/recording-log?startDate={startDate}&endDate={endDate}` - Fetch recording logs from DynamoDB
- `POST /api/recording` - Requeue a failed recording (update DynamoDB item)

**Expected Response Format (DynamoDB flattened structure):**

```json
[
  {
    "TaskId": "task-12345",
    "AgentName": "John Doe",
    "FormName": "Sample Form",
    "Program": "Program A",
    "DocumentumID": "DOC001",
    "CaseNum": "CASE001",
    "AppNum": "APP001",
    "CreatedOn": "2024-01-01T10:00:00Z",
    "Status": 2,
    "StatusMessage": ""
  }
]
```

**Status Codes:**
- 1: QUEUED
- 2: SUCCESS
- 3: FAILURE
- 4: PROCESSING
- 5: FAILURE (with retry option)

## DynamoDB Table Structure

### Table Schema

**Table Name:** `RecordingLogs` (or your preferred name)

**Primary Key:**
- Partition Key: `TaskId` (String)

**Attributes:**
- `TaskId` (String) - Primary identifier
- `AgentName` (String) - Name of the agent
- `FormName` (String) - Name of the form
- `Program` (String) - Program identifier
- `DocumentumID` (String) - Documentum identifier
- `CaseNum` (String) - Case number
- `AppNum` (String) - Application number
- `CreatedOn` (String/Number) - Timestamp (ISO 8601 string or Unix timestamp)
- `Status` (Number) - Status code (1-5)
- `StatusMessage` (String) - Error or status message

**Global Secondary Index (GSI) for Date Range Queries:**
- GSI Name: `CreatedOnIndex`
- Partition Key: `Status` (Number) - Optional, for filtering by status
- Sort Key: `CreatedOn` (String/Number) - For date range queries

### DynamoDB Setup Example (AWS CLI)

```bash
aws dynamodb create-table \
    --table-name RecordingLogs \
    --attribute-definitions \
        AttributeName=TaskId,AttributeType=S \
        AttributeName=CreatedOn,AttributeType=S \
    --key-schema \
        AttributeName=TaskId,KeyType=HASH \
    --global-secondary-indexes \
        "[{\"IndexName\":\"CreatedOnIndex\",\"KeySchema\":[{\"AttributeName\":\"CreatedOn\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}}]" \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | AWS API Gateway endpoint URL | `https://abc123.execute-api.us-east-1.amazonaws.com/prod/api` |

### AWS Backend Configuration

Your backend should consist of:

1. **AWS API Gateway** - REST API endpoint
2. **AWS Lambda Functions** - Business logic handlers
   - `getRecordingLogs` - Query/Scan DynamoDB with date filtering
   - `requeueRecording` - Update DynamoDB item status
3. **AWS DynamoDB** - NoSQL database table
4. **IAM Roles** - Lambda execution role with DynamoDB permissions

**Required Lambda Permissions:**
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
        "arn:aws:dynamodb:*:*:table/RecordingLogs",
        "arn:aws:dynamodb:*:*:table/RecordingLogs/index/*"
      ]
    }
  ]
}
```

## Technologies Used

- **React 18** - UI framework
- **React Bootstrap** - UI components
- **React Data Table Component** - Advanced data tables
- **Axios** - HTTP client
- **Moment.js** - Date formatting
- **React Toastify** - Toast notifications
- **Font Awesome** - Icons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend API allows requests from your React app domain:
```javascript
Access-Control-Allow-Origin: https://your-react-app-domain.com
```

### API Connection Issues
1. Verify the `REACT_APP_API_BASE_URL` in `.env.local`
2. Check network tab in browser DevTools
3. Ensure backend API is running and accessible

### Build Fails
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## License

Copyright © 2025 - All rights reserved.

## Support

For issues or questions, please contact your development team.
