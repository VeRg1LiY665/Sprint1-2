import nodemailer from 'nodemailer'
import {SETTINGS} from "../../settings";

export const nodemailerService = {
    async sendEmail(
        email: string,
        code: string,
        template: (code: string) => string
    ): Promise<boolean> {
        let transporter = nodemailer.createTransport({
            service: 'yandex',
            auth: {
                user: SETTINGS.EMAIL,
                pass: SETTINGS.EMAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: '"Blog Platform registration service" <verg1liy@yandex.ru>',
            to: email,
            subject: 'Your code is here',
            html: template(code), // html body
        });

        return !!info;
    },
};