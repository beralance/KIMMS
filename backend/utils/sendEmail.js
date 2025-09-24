// utils/sendEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text version
 * @param {string} options.html - HTML version
 */
export const sendEmail = async ({ to, subject, text, html }) => {
    try {
        // create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,   // e.g., smtp.gmail.com
            port: parseInt(process.env.EMAIL_PORT),   // 587 for TLS, 465 for SSL
            secure: parseInt(process.env.EMAIL_PORT) == 465, // true for 465, false for 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            logger: true,
            debug: true
        });

        // send mail
        const info = await transporter.sendMail({
            from: `"Kimms Furniture and Merchandise" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log(`✅ Email sent: ${info.messageId}`);
        return info;
    } catch (err) {
        console.error("❌ Email send failed:", err);
        throw new Error("Email could not be sent");
    }
};
