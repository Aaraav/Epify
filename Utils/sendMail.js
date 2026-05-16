import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: parseInt(process.env.BREVO_PORT),
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
    },
    tls: {
        // Keeps local development smooth if you hit self-signed certificate issues
        rejectUnauthorized: false,
    },
});

export const sendMail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: `"Epify Notes" <${process.env.SENDER_EMAIL}>`,
            to,
            bcc: process.env.SENDER_EMAIL,
            subject,
            text,
        });

        console.log('Mail Sent:', info);
    } catch (err) {
        console.error('Error sending mail via Brevo:', err);
    }
};
