import nodemailer from 'nodemailer';

interface NotificationPayload {
  pipelineName: string;
  status: string;
  buildTime: number;
  logs: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEmailNotification = async (payload: NotificationPayload) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.ALERT_EMAIL_RECIPIENTS,
    subject: `Pipeline Alert: ${payload.pipelineName} - ${payload.status}`,
    html: `
      <h2>Pipeline Execution Alert</h2>
      <p><strong>Pipeline:</strong> ${payload.pipelineName}</p>
      <p><strong>Status:</strong> ${payload.status}</p>
      <p><strong>Build Time:</strong> ${payload.buildTime}s</p>
      <h3>Logs:</h3>
      <pre>${payload.logs.substring(0, 1000)}...</pre>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw error;
  }
};
