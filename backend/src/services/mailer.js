const nodemailer = require("nodemailer");

async function sendMail(to, subject, text) {
  if (!process.env.SMTP_HOST) {
    console.log("[MAIL NOT CONFIGURED]", { to, subject });
    return false;
  }
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  await transport.sendMail({ from: process.env.SMTP_FROM, to, subject, text });
  return true;
}

module.exports = { sendMail };
