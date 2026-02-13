import nodemailer from "nodemailer";

import { env } from "../config/env";

export function getMailer() {
  if (!env.smtpUser || !env.smtpPass) {
    throw new Error("SMTP credentials not configured");
  }
  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
}

export async function sendOtpEmail(input: { to: string; code: string }) {
  const transporter = getMailer();
  const from = env.smtpFrom || env.smtpUser;
  const subject = "PH Performance verification code";
  const html = `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#0b0f0c; color:#e6f4ea; padding:24px;">
    <div style="max-width:520px; margin:0 auto; background:#0f1612; border:1px solid #1c2b22; border-radius:16px; padding:24px;">
      <h1 style="margin:0 0 8px; font-size:22px; color:#c7ffd6;">PH Performance</h1>
      <p style="margin:0 0 16px; color:#b3c3b8;">Your verification code</p>
      <div style="font-size:28px; letter-spacing:6px; font-weight:700; color:#3ddc84; margin:12px 0;">
        ${input.code}
      </div>
      <p style="margin:0; color:#8ea097; font-size:12px;">
        This code expires in 10 minutes. If you didn’t request it, you can ignore this email.
      </p>
    </div>
  </div>`;

  await transporter.sendMail({
    from,
    to: input.to,
    subject,
    html,
  });
}
