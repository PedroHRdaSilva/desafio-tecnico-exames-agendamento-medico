import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import jwt from 'jsonwebtoken';

export const TOKEN_COOKIE = 'token';

export interface AccessTokenPayload {
  type: 'access';
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

export type AuthenticatedRequest = Request & {
  user: AccessTokenPayload['user'];
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AccessTokenPayload['user'] }>();

    const cookies = request.cookies as Record<string, string> | undefined;
    const cookieToken = cookies?.[TOKEN_COOKIE];
    const [scheme, headerToken] =
      request.headers.authorization?.split(' ') ?? [];
    const token =
      cookieToken || (scheme === 'Bearer' ? headerToken : undefined);

    if (!token) {
      throw new UnauthorizedException('Token não informado');
    }

    let payload: jwt.JwtPayload | string;
    try {
      payload = jwt.verify(token, this.config.getOrThrow<string>('JWTSECRET'), {
        algorithms: ['HS512'],
      });
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    // Só aceita token de sessão: o token de reset de senha tem type 'reset'
    if (typeof payload === 'string' || payload.type !== 'access') {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    request.user = (payload as unknown as AccessTokenPayload).user;
    return true;
  }
}
