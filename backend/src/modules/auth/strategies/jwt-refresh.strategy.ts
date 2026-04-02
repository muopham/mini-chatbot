import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      // Cách lấy JWT từ request body (vì refresh token gửi trong body)
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      
      // Secret key riêng cho refresh token
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      
      ignoreExpiration: false,
    });
  }

  /**
   * =====================================================
   * VALIDATE - Xác thực Refresh JWT payload
   * =====================================================
   * Dùng riêng cho refresh token
   * Strategy name: 'jwt-refresh' (để phân biệt với access token)
   */
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
