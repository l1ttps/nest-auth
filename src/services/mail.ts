import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SendMailService {
    constructor(
    ) { }

    async sendMail(msg) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD_EMAIL
            }
        });

        try {
            await transporter.sendMail(msg);
        } catch (error) {
            console.log(error);
        }

    }


    sendOTPSignUp(verifyCode: string, targetEmail: string): Promise<void> {

        const MSG = {
            from: `"Nest Auth" <${targetEmail}>`,
            to: targetEmail,
            subject: 'Verify Code Signup Account Nest Auth',
            html: verifyCode,
        };
        return this.sendMail(MSG);
    }


}
