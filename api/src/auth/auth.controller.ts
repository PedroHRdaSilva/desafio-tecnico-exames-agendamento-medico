import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import {
  JwtAuthGuard,
  TOKEN_COOKIE,
  type AuthenticatedRequest,
} from './jwt-auth.guard.js';

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Realiza login do usuário' })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  @ApiUnauthorizedResponse({ description: 'E-mail ou senha inválidos' })
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.authService.login(email, password);

    res.cookie(TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: SIX_HOURS_MS,
    });

    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna os dados do usuário logado' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  me(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Encerra a sessão removendo o cookie do token' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(TOKEN_COOKIE, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return { success: true };
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Envia e-mail para redefinir a senha',
    description:
      'Responde com sucesso mesmo se o e-mail não estiver cadastrado, para não revelar quais e-mails têm conta. O e-mail só é enviado se o usuário existir.',
  })
  @ApiBadRequestResponse({ description: 'E-mail inválido' })
  forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Redefine a senha com o token recebido por e-mail' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou token inválido/expirado',
  })
  resetPassword(@Body() { token, password }: ResetPasswordDto) {
    return this.authService.resetPassword(token, password);
  }
}
