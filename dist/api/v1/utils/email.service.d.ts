import { MailerService } from '@nestjs-modules/mailer';
export declare class EmailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendEmail(email: string, firstName: string, otp: string): Promise<{
        errorCode: number;
        errorMessage: string;
    }>;
}
