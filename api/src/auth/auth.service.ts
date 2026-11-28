import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../users/entities/user.entity.js';
import { MailService } from '../email/mail.service.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userModel
      .findOne({
        email: email.toLowerCase().trim(),
        deletedAt: null,
      })
      .select('+password');

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const token = jwt.sign(
      {
        type: 'access',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      this.config.getOrThrow<string>('JWTSECRET'),
      { algorithm: 'HS512', expiresIn: '6h' },
    );

    return { token };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({
      email: email.toLowerCase().trim(),
      deletedAt: null,
    });

    // Responde igual exista ou não o e-mail, para não revelar quem tem conta
    if (!user) {
      return true;
    }

    const resetPasswordToken = jwt.sign(
      {
        type: 'reset',
        user: {
          _id: user._id,
          email: user.email,
        },
      },
      this.config.getOrThrow<string>('JWTSECRET'),
      { algorithm: 'HS512', expiresIn: '6h' },
    );

    const experiedDate = new Date(Date.now() + 6 * 60 * 60 * 1000);

    await this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          passwordResetExpires: experiedDate,
          passwordResetToken: resetPasswordToken,
        },
      },
    );

    await this.mailService.sendResetPasswordEmail(
      user.email,
      user.name,
      resetPasswordToken,
    );

    return true;
  }

  async resetPassword(token: string, password: string) {
    const user = await this.userModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userModel.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { passwordResetToken: 1, passwordResetExpires: 1 },
      },
    );

    return true;
  }
}
