// Jenkins integration example - add to pipeline webhook documentation
const jenkinsPayloadExample = {
  "pipeline_id": 1,
  "status": "SUCCESS", // or "FAILURE"
  "start_time": "2023-08-28T10:00:00Z",
  "end_time": "2023-08-28T10:05:00Z",
  "logs": "Build logs from Jenkins...",
  
  // Jenkins specific fields (optional)
  "jenkins": {
    "job_name": "MyPipeline",
    "build_number": "123",
    "build_url": "http://jenkins-url/job/MyPipeline/123"
  }
};

// Add to Jenkins pipeline:
/*
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
                url: 'http://dashboard-url/api/pipelines/webhook',
                httpMode: 'POST',
                contentType: 'APPLICATION_JSON',
                requestBody: groovy.json.JsonOutput.toJson(payload)
            )
        }
    }
}
*/
