import nodemailer from 'nodemailer';
import 'dotenv/config';

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        
        const message = {
            from: options.from,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
            attachments: options.attachments,
        };

        await transporter.sendMail(message);
        
        return true;
    } catch (error) {
        console.error(error);

        console.log(JSON.stringify(error, null, 2));
    }
};

export default sendEmail;