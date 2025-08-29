# Integration Guide

This document describes how to integrate your CI/CD pipelines with the Pipeline Health Dashboard.

## GitHub Actions Integration

1. Add the following secrets to your repository:
   - `DASHBOARD_URL`: The URL where your dashboard is deployed

2. The dashboard automatically captures workflow runs using the `.github/workflows/report-status.yml` workflow.

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
