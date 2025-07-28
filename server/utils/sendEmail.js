const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Create transporter
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,       // Your Gmail address
        pass: process.env.EMAIL_PASS.trim() // Your Gmail app password (trim to remove spaces)
      },
    });

    // Email options
    const mailOptions = {
      from: `"HNC-Task Management" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
