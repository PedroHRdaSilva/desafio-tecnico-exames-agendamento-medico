import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter?: Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {}

  private async getTransporter(): Promise<Transporter> {
    if (this.transporter) return this.transporter;

    const host = this.config.get<string>('SMTP_HOST');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');

    if (host && user && pass) {
      const port = Number(this.config.get<string>('SMTP_PORT') ?? 587);

      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();

      this.transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });

      this.logger.warn(
        'SMTP não configurado, usando conta de teste do Ethereal',
      );
    }

    return this.transporter;
  }

  async sendMail(to: string, subject: string, html: string) {
    const transporter = await this.getTransporter();

    const info = await transporter.sendMail({
      from:
        this.config.get<string>('MAIL_FROM') ??
        'Agendamento <no-reply@agendamento.com>',
      to,
      subject,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    this.logger.log(
      previewUrl
        ? `Visualize o e-mail em: ${previewUrl}`
        : `E-mail enviado: ${info.messageId}`,
    );
  }

  async sendResetPasswordEmail(to: string, name: string, token: string) {
    const url = `${this.config.getOrThrow<string>('FRONTEND_URL')}/reset-password?token=${token}`;

    await this.sendMail(
      to,
      'Redefinição de senha',
      `
        <p>Olá, ${name}!</p>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p><a href="${url}">Clique aqui para criar uma nova senha</a></p>
        <p>O link expira em 6 horas. Se não foi você, ignore este e-mail.</p>
      `,
    );
  }
}
