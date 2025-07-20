# Google Cloud SDK Setup Guide

## Overview

This project requires Google Cloud SDK for certain AI and cloud services integration. The SDK is not included in the repository to keep it clean and avoid licensing issues.

## Installation Methods

### Method 1: Direct Installation (Recommended)

#### Linux/macOS
```bash
# Download and install
curl https://sdk.cloud.google.com | bash

# Restart shell or run:
source ~/.bashrc

# Initialize gcloud
gcloud init
```

#### Windows
1. Download the installer from: https://cloud.google.com/sdk/docs/install
2. Run the installer
3. Restart command prompt
4. Run `gcloud init`

### Method 2: Docker Installation

```bash
# Pull the official Google Cloud SDK image
docker pull gcr.io/google.com/cloudsdktool/cloud-sdk:latest

# Run commands using Docker
docker run --rm -it gcr.io/google.com/cloudsdktool/cloud-sdk:latest gcloud --version
```

### Method 3: Package Manager

#### Ubuntu/Debian
```bash
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
sudo apt-get update && sudo apt-get install google-cloud-sdk
```

#### macOS (Homebrew)
```bash
brew install --cask google-cloud-sdk
```

## Configuration

### 1. Authentication
```bash
# Login to your Google Cloud account
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID
```

### 2. Service Account (for production)
```bash
# Create and download service account key
gcloud iam service-accounts create soul-chronicle-service
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:soul-chronicle-service@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/editor"

# Download key file
gcloud iam service-accounts keys create ./service-account-key.json \
  --iam-account=soul-chronicle-service@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 3. Environment Variables
Add to your `.env` file:
```bash
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
GOOGLE_CLOUD_PROJECT=your-project-id
```

## Required APIs

Enable the following APIs for this project:

```bash
# AI and ML APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable ml.googleapis.com

# Storage APIs (if needed)
gcloud services enable storage.googleapis.com

# Other APIs as needed
gcloud services enable cloudfunctions.googleapis.com
```

## Verification

Test your setup:
```bash
# Check gcloud version
gcloud --version

# List active configuration
gcloud config list

# Test API access
gcloud ai-platform models list
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Ensure you're authenticated: `gcloud auth list`
   - Check project permissions
   - Verify service account roles

2. **API Not Enabled**
   - Enable required APIs using the commands above
   - Wait a few minutes for propagation

3. **Quota Exceeded**
   - Check your quota limits in Google Cloud Console
   - Request quota increases if needed

### Getting Help

- Google Cloud SDK Documentation: https://cloud.google.com/sdk/docs
- Troubleshooting Guide: https://cloud.google.com/sdk/docs/troubleshooting
- Community Support: https://stackoverflow.com/questions/tagged/google-cloud-sdk

## Security Notes

- Never commit service account keys to version control
- Use IAM roles with minimal required permissions
- Regularly rotate service account keys
- Use workload identity in production environments

## Alternative: Cloud Shell

If you prefer not to install locally, you can use Google Cloud Shell which has the SDK pre-installed:
https://cloud.google.com/shell