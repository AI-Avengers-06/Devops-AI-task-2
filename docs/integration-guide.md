# Integration Guide

This document describes how to integrate your CI/CD pipelines with the Pipeline Health Dashboard.

## GitHub Actions Integration

1. Add the following secrets to your repository:
   - `DASHBOARD_URL`: The URL where your dashboard is deployed
   - `SLACK_WEBHOOK_URL`: Your Slack webhook URL for notifications
   - `SMTP_CONFIG`: JSON string containing email configuration

2. Add the report-status workflow to your repository:
   ```yaml
   name: Report Status
   on: 
     workflow_run:
       workflows: ["*"]
       types: [completed]

   jobs:
     report:
       runs-on: ubuntu-latest
       steps:
         - name: Report workflow status
           uses: actions/github-script@v6
           with:
             script: |
               const response = await fetch(`${process.env.DASHBOARD_URL}/api/pipelines`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                   name: context.workflow,
                   status: context.conclusion,
                   duration: Date.now() - new Date(context.started_at).getTime(),
                   repository: context.repository
                 })
               });
               if (!response.ok) {
                 throw new Error(`Failed to report status: ${response.statusText}`);
               }
           env:
             DASHBOARD_URL: ${{ secrets.DASHBOARD_URL }}
   ```

3. Enable Slack Notifications:
   ```yaml
   - name: Send Slack notification
     if: failure()
     uses: slackapi/slack-github-action@v1.24.0
     with:
       payload: |
         {
           "text": "Pipeline failed: ${{ github.workflow }}\nRepository: ${{ github.repository }}"
         }
     env:
       SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
   ```

## Jenkins Integration

1. Install the HTTP Request Plugin in Jenkins

2. Add a post-build step to your Jenkins pipeline:
   ```groovy
   pipeline {
     // ... your existing pipeline config ...
     
     post {
       always {
         script {
           def status = currentBuild.result ?: 'SUCCESS'
           def duration = System.currentTimeMillis() - currentBuild.startTimeInMillis
           
           httpRequest(
             url: DASHBOARD_URL + '/api/pipelines',
             httpMode: 'POST',
             contentType: 'APPLICATION_JSON',
             requestBody: """
               {
                 "name": "${env.JOB_NAME}",
                 "status": "${status}",
                 "duration": ${duration},
                 "repository": "jenkins/${env.JOB_NAME}"
               }
             """
           )
         }
       }
     }
   }
   ```

## API Endpoints

The dashboard exposes the following endpoints:

1. `POST /api/pipelines`
   - Records pipeline execution data
   - Body: `{ name, status, duration, repository }`

2. `GET /api/pipelines`
   - Retrieves pipeline execution history
   - Query params: `?repository=<repo>&days=7`

3. `GET /api/pipelines/metrics`
   - Returns aggregated metrics
   - Query params: `?repository=<repo>&days=7`

3. No additional configuration needed - the workflow will automatically report all pipeline executions.

## Jenkins Integration

1. Install required Jenkins plugins:
   - HTTP Request Plugin
   - Pipeline Utility Steps

2. Add the dashboard URL to Jenkins credentials:
   - Go to Manage Jenkins > Manage Credentials
   - Add a new Secret text credential with ID `dashboard_url`

3. Add the following post block to your Jenkinsfile:
```groovy
post {
    always {
        script {
            def payload = [
                pipeline_id: 1,
                status: currentBuild.result,
                start_time: currentBuild.startTimeInMillis,
                end_time: currentBuild.timeInMillis,
                logs: currentBuild.log,
                jenkins: [
                    job_name: env.JOB_NAME,
                    build_number: env.BUILD_NUMBER,
                    build_url: env.BUILD_URL
                ]
            ]
            
            httpRequest(
                url: credentials('dashboard_url') + '/api/pipelines/webhook',
                httpMode: 'POST',
                contentType: 'APPLICATION_JSON',
                requestBody: groovy.json.JsonOutput.toJson(payload)
            )
        }
    }
}
```

## Webhook API Reference

The dashboard accepts webhook requests at `/api/pipelines/webhook` with the following format:

```json
{
  "pipeline_id": number,
  "status": string,
  "start_time": string (ISO 8601),
  "end_time": string (ISO 8601),
  "logs": string,
  "source": {
    "type": string ("github" | "jenkins"),
    "url": string,
    "job_name": string,
    "build_number": string
  }
}
```
