export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

export class EmailService {
  /**
   * Abstracted method to send emails. 
   * In the future, this can wrap SendGrid, Resend, or AWS SES.
   */
  static async sendEmail(options: EmailOptions): Promise<boolean> {
    // TODO: Implement actual email provider
    console.log(`[MOCK EMAIL] Sending to ${options.to}: ${options.subject}`);
    return true;
  }

  static async sendVerificationEmail(to: string, token: string): Promise<boolean> {
    const link = `https://pocketca.app/verify-email?token=${token}`;
    return this.sendEmail({
      to,
      subject: 'Verify your PocketCA account',
      body: `Please verify your email using this link: ${link}`,
    });
  }

  static async sendPasswordResetEmail(to: string, token: string): Promise<boolean> {
    const link = `https://pocketca.app/reset-password?token=${token}`;
    return this.sendEmail({
      to,
      subject: 'Reset your PocketCA password',
      body: `Reset your password using this link: ${link}`,
    });
  }
}
