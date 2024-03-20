import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, text: string,): Promise<any> {
    try{
      await this.mailerService.sendMail({
        to,
        from: process.env.EMAIL_ADD,
        subject,
        text,
      });
      return { errorCode: 200, errorMessage: 'true' }  
    }
    catch(err)
    {
      return { errorCode: 500, errorMessage: 'Otp not Send.' }  
    }
  }
}
