# AWS Amplify Deployment Guide

Complete step-by-step guide to deploy the Recording Log application to AWS Amplify.

## Prerequisites

- AWS Account
- Git repository (GitHub, GitLab, or Bitbucket)
- Your API Gateway endpoint URL
- Node.js and npm installed locally

## Step 1: Prepare Your Project

### 1.1 Create `.gitignore` (if not exists)
Ensure these are in your `.gitignore`:
```
node_modules/
build/
.env.local
.DS_Store
npm-debug.log*
```

### 1.2 Create Environment Configuration
Create `.env.example` file:
```
REACT_APP_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/prod
```

### 1.3 Commit and Push to Git
```powershell
git add .
git commit -m "Prepare for Amplify deployment"
git push origin main
```

## Step 2: Deploy to AWS Amplify (Console Method)

### 2.1 Access AWS Amplify Console
1. Log in to [AWS Console](https://console.aws.amazon.com/)
2. Search for **"Amplify"** in the services search bar
3. Click **"AWS Amplify"**

### 2.2 Create New App
1. Click **"New app"** → **"Host web app"**
2. Choose your Git provider (GitHub, GitLab, Bitbucket, or AWS CodeCommit)
3. Click **"Continue"**

### 2.3 Authorize and Select Repository
1. Authorize AWS Amplify to access your Git account
2. Select the repository: **TSRecordLog**
3. Select the branch: **main** (or your primary branch)
4. Click **"Next"**

### 2.4 Configure Build Settings
Amplify will auto-detect your React app. The default build settings should look like:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

Click **"Next"**

### 2.5 Add Environment Variables
1. Expand **"Advanced settings"**
2. Under **"Environment variables"**, click **"Add environment variable"**
3. Add:
   - **Key:** `REACT_APP_API_BASE_URL`
   - **Value:** Your API Gateway URL (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/prod`)
4. Click **"Next"**

### 2.6 Review and Deploy
1. Review all settings
2. Click **"Save and deploy"**
3. Wait for deployment (usually 2-5 minutes)

### 2.7 Access Your App
Once deployed, Amplify provides:
- **App URL:** `https://main.xxxxxx.amplifyapp.com`
- Click the URL to view your deployed app

## Step 3: Configure Custom Domain (Optional)

### 3.1 Add Custom Domain
1. In Amplify Console, click your app
2. Click **"Domain management"** in left sidebar
3. Click **"Add domain"**
4. Enter your domain name
5. Follow DNS configuration instructions

### 3.2 SSL Certificate
- Amplify automatically provisions SSL certificate via AWS Certificate Manager
- HTTPS is enabled by default

## Step 4: Set Up Continuous Deployment

Amplify automatically deploys when you push to your Git repository:

```powershell
# Make code changes
git add .
git commit -m "Update feature"
git push origin main
```

Amplify will:
1. Detect the push
2. Pull latest code
3. Run build
4. Deploy automatically

## Step 5: Monitor and Troubleshoot

### 5.1 View Build Logs
1. Go to Amplify Console
2. Click on your app
3. Click on the latest build
4. View detailed logs for each phase

### 5.2 Common Issues

**Build Fails:**
- Check build logs in Amplify Console
- Verify `package.json` has correct scripts
- Ensure environment variables are set

**App Loads but API Fails:**
- Verify `REACT_APP_API_BASE_URL` environment variable
- Check API Gateway CORS settings
- Verify API Gateway is deployed to correct stage

**CORS Errors:**
Ensure your API Gateway has CORS enabled with these headers:
```
Access-Control-Allow-Origin: https://your-amplify-domain.amplifyapp.com
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Methods: GET, POST, OPTIONS
```

## Alternative: Deploy via Amplify CLI

### Install Amplify CLI
```powershell
npm install -g @aws-amplify/cli
amplify configure
```

### Initialize Amplify Project
```powershell
cd D:\Projects\TSRecordLog
amplify init
```

Follow prompts:
- **Enter a name for the project:** TSRecordLog
- **Enter a name for the environment:** prod
- **Choose your default editor:** Visual Studio Code
- **Choose the type of app:** javascript
- **What javascript framework:** react
- **Source Directory Path:** src
- **Distribution Directory Path:** build
- **Build Command:** npm run build
- **Start Command:** npm start
- **Do you want to use an AWS profile?** Yes
- **Please choose the profile:** default (or your AWS profile)

### Add Hosting
```powershell
amplify add hosting
```

Choose:
- **Select the plugin module to execute:** Hosting with Amplify Console
- **Choose a type:** Manual deployment

### Deploy
```powershell
amplify publish
```

This will:
1. Build your React app
2. Deploy to Amplify
3. Provide you with the app URL

## Step 6: Update Environment Variables

If you need to change environment variables after deployment:

### Via Console:
1. Go to Amplify Console
2. Click your app
3. Click **"Environment variables"** in left sidebar
4. Edit or add variables
5. Click **"Save"**
6. Redeploy: Click **"Redeploy this version"**

### Via CLI:
```powershell
amplify env update
```

## Step 7: Set Up Multiple Environments (Optional)

Create separate environments for dev/staging/prod:

```powershell
# Create staging environment
amplify env add staging

# Switch between environments
amplify env checkout prod
amplify env checkout staging

# Deploy specific environment
amplify publish --env staging
```

## Cost Estimate

AWS Amplify Pricing (as of 2025):
- **Build & Deploy:** $0.01 per build minute
- **Hosting:** $0.15 per GB served
- **Free Tier:** 
  - 1000 build minutes/month
  - 15 GB served/month
  - 5 GB stored/month

**Estimated Monthly Cost:** $0-5 for small to medium traffic apps

## Production Checklist

Before going live:
- ✅ Environment variables configured
- ✅ Custom domain set up (if needed)
- ✅ SSL certificate active
- ✅ API Gateway CORS configured
- ✅ Error monitoring enabled
- ✅ Branch protection rules set in Git
- ✅ Backup DynamoDB table
- ✅ Test all features in production URL

## Useful Commands

```powershell
# View app status
amplify status

# View app URL
amplify console

# Delete app (careful!)
amplify delete
```

## Support Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Amplify Console Troubleshooting](https://docs.aws.amazon.com/amplify/latest/userguide/troubleshooting.html)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)

## Next Steps After Deployment

1. **Set up monitoring:** Enable AWS CloudWatch for error tracking
2. **Configure backups:** Set up DynamoDB backups
3. **Add authentication:** Consider AWS Cognito if user login needed
4. **Performance monitoring:** Use Amplify Analytics
5. **CI/CD enhancements:** Add automated tests before deployment
