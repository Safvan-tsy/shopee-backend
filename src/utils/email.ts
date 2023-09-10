import nodemailer from 'nodemailer';
import pug from 'pug';
import htmlToText from 'html-to-text';

interface User {
  email: string;
  name: string;
}

export class Email {
  private to: string;
  private firstName: string;
  private url: string;
  private otp: string;
  private from: string;

  constructor(user: User, otp?:string ,url?: string) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.otp = otp
    this.from = `Shopee <${process.env.EMAIL_FROM}>`;
  }

  private newTransport() {
    
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME!,
          pass: process.env.SENDGRID_PASSWORD!,
        },
      });
    
  }
  async send(template: string, subject: string) {

    // const html = pug.renderFile(`${__dirname}/../../public/views/email/${template}.pug`, {
    //     firstName: this.firstName,
    //     otp: this.otp,
    //     subject,
    //   });
    

    const mailOptions: nodemailer.SendMailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: "htmlToText.fromString(html)",
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendDeliveryOtp() {
    await this.send('verification', 'OTP to take delivery!');
  }

  async sendEmailConfirmOtp() {
    await this.send('verification', 'Confirm your email!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
}