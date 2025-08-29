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
  // Check if SMTP is properly configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || process.env.SMTP_PASS === 'your_app_password') {
    console.log('📧 Email notification skipped - SMTP credentials not configured');
    console.log(`Would send email to: ${process.env.ALERT_EMAIL_RECIPIENTS}`);
    console.log(`Subject: Pipeline Alert: ${payload.pipelineName} - ${payload.status}`);
    return;
  }

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
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw error;
  }
};
