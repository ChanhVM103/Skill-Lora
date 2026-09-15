import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
const { TokenExpiredError } = jwt;
import { TokenService } from '../../modules-system/token/token.service.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../modules-system/prisma/prisma.service.js';

@Injectable()
export class ProtectGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.tokenService.verifyAccessToken(token);

      const userExists = await this.prisma.users.findUnique({
        where: {
          id: (payload as any).userId,
        },
      });
      if (!userExists) {
        throw new UnauthorizedException('User not found');
      }

      (request as any)['user'] = userExists;
    } catch (err: unknown) {
      console.log(`[ProtectGuard] - `, err);
      if (err instanceof TokenExpiredError) {
        throw new ForbiddenException(err.message);
      }
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
