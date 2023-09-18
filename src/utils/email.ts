import nodemailer from 'nodemailer';

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
    this.from = `Shorpe <${process.env.EMAIL_FROM}>`;
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
    let html = '';

    if (template === 'welcome') {
      html = `
      <html>
      <body>
        <div style="text-align: center;">
        <h2>Hello ${this.firstName},</h2>
        <p>Welcome to the shorpee!</p>
        </div>
      </body>
    </html>
      `;
    } else if (template === 'verification') {
      html = `
      <html>
      <body>
        <div style="text-align: center;">
          <h1>Hello ${this.firstName},</h1>
          <p>${subject}</p>
          <b>${this.otp}</b>
        </div>
      </body>
    </html>
      `;
    } else if (template === 'passwordReset') {
      html = `
        <p>Hello ${this.firstName},</p>
        <p>Your password reset token (valid for only 10 minutes)</p>
      `;
    }else if (template === 'delivered') {
      html = `
      <html>
      <body>
        <div style="text-align: center;">
          <h1>Hello ${this.firstName},</h1>
          <p>${subject}</p>
          <b> Thank you for shopping whith us !</b>
        </div>
      </body>
    </html>
      `;
    }else if (template === 'cancelled') {
      html = `
      <html>
      <body>
        <div style="text-align: center;">
          <h1>Hello ${this.firstName},</h1>
          <b> ${subject}</b>
          <p> We are really sorry to inform you that due to some issues your order has been cancelled . please try again after some time </p>
        </div>
      </body>
    </html>
      `;
    } 
    

    const mailOptions: nodemailer.SendMailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Shorpee !');
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

  async sendOrderDelivered() {
    await this.send(
      'delivered',
      'Your order has been delivered !'
    );
  }

  async sendOrderCancelled(){
    await this.send(
      'cancelled',
      'Your order has been Cancelled !'
    );
  }

}