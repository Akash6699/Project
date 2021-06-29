import * as nodemailer from 'nodemailer';
import config from '../config';
import Logger from '../loaders/logger';
import { Service } from 'typedi';

@Service()
export class dynamicMailer {
    transporter;

    public constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.SMTP_HOST,
            port: config.SMTP_PORT,
            secure: false,
            service: 'gmail',
            auth: {
                user: config.SMTP_USER,
                pass: config.SMTP_PASSWORD,
            },
        });
    }

    public async APIBackendService(data: any) {
        const mailOptions = {
            from: config.SMTP_USER,
            to: data.receivers,
            subject: data.subject,
            html: data.body,
        };
        this.transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                Logger.error(error);
            }
        });
    }
}
