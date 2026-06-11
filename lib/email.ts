import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT ?? '587'),
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
});

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Verify your CareerForge account',
    html: `<h2>Welcome to CareerForge!</h2><p>Click to verify: <a href="${url}">${url}</a></p><p>Expires in 24 hours.</p>`,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Reset your CareerForge password',
    html: `<h2>Password Reset</h2><p>Click to reset: <a href="${url}">${url}</a></p><p>Expires in 1 hour.</p>`,
  });
}

export async function sendNotificationEmail(to: string, subject: string, body: string) {
  await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, html: `<p>${body}</p>` });
}
