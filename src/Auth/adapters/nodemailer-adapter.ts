import nodemailer from 'nodemailer'
import {SETTINGS} from "../../settings";

export const nodemailerService = {
    async sendEmail(
        email: string,
        code: string,
        template: (code: string) => string
    ): Promise<boolean> {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: SETTINGS.EMAIL,
                pass: SETTINGS.EMAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: '"Blog Platform registration service" <platform@gmail.com>',
            to: email,
            subject: 'Your code is here',
            html: template(code), // html body
        });

        return !!info;
    },
};