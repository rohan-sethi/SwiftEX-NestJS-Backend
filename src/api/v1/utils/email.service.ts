import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(email: string, firstName: string, otp: string) {
    try{
      await this.mailerService.sendMail({
        to: email,
        from:'"SwiftEx" <' + process.env.EMAIL_ADD + '>',
        subject: 'One-Time Passcode Verification',
        template: 'emailVerification',
        context: {
          firstName,
          otp,
        },
      })
      return { errorCode: 200, errorMessage: 'OTP sent successfully' };
    } catch (error) {
      return { errorCode: 500, errorMessage: 'Error sending email' };
    }
  }
}
