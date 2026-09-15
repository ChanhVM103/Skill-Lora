import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../../common/constant/app.constant.js';

@Injectable()
export class TokenService {
  createTokens(userId: string) {
    const accessTokenSecret = ACCESS_TOKEN_SECRET || 'access_secret';
    const refreshTokenSecret = REFRESH_TOKEN_SECRET || 'refresh_secret';

    const accessToken = jwt.sign({ userId }, accessTokenSecret, {
      expiresIn: '1d',
    });

    const refreshToken = jwt.sign({ userId }, refreshTokenSecret, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  verifyAccessToken(token: string) {
    const accessTokenSecret = ACCESS_TOKEN_SECRET || 'access_secret';
    return jwt.verify(token, accessTokenSecret);
  }

  verifyRefreshToken(token: string) {
    const refreshTokenSecret = REFRESH_TOKEN_SECRET || 'refresh_secret';
    return jwt.verify(token, refreshTokenSecret);
  }
}
