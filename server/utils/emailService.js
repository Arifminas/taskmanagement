const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,       // Your Gmail address
        pass: process.env.EMAIL_PASS.trim() // Your Gmail app password (trim to remove spaces)
      },
    });

async function sendEmail1(to, subject, text, html) {
  await transporter.sendMail({
    from: `"Task Management" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendEmail1 };
