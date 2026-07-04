import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()

export const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,  
            port: parseInt(process.env.EMAIL_PORT),   
            secure: parseInt(process.env.EMAIL_PORT) == 465,
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
