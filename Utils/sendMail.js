import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
        service:'gmail',
        secure:true,
        port: 465,
        auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        },
        // Add timeout settings for Render
        connectionTimeout: 10000,
        socketTimeout: 10000,
        greetingTimeout: 10000
      });

export const sendMail = async (to, subject, text) => {

    try {

        const info = await transporter.sendMail({
            from: `"Epify Notes" <${process.env.EMAIL}>`,
            to,
            bcc: process.env.EMAIL,
            subject,
            text,
        });

        console.log('Mail Sent:', info.messageId);

    } catch (err) {

        console.log(err);
    }
};