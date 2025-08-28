import axios from 'axios';

interface NotificationPayload {
  pipelineName: string;
  status: string;
  buildTime: number;
  logs: string;
}

export const sendSlackNotification = async (payload: NotificationPayload) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('Slack webhook URL not configured');
  }

  const message = {
    text: `🔔 Pipeline Alert: ${payload.pipelineName}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Pipeline:* ${payload.pipelineName}\n*Status:* ${payload.status}\n*Build Time:* ${payload.buildTime}s`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Logs:*\n\`\`\`${payload.logs.substring(0, 1000)}...\`\`\``
        }
      }
    ]
  };

  try {
    await axios.post(webhookUrl, message);
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    throw error;
  }
};
