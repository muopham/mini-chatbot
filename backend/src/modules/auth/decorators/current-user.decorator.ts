import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * =====================================================
 * @CURRENTUSER - Lấy thông tin user từ JWT
 * =====================================================
 * Dùng để lấy userId, email từ request.user
 * (Được gán bởi JwtStrategy sau khi xác thực token)
 *
 * Cách dùng:
 * @UseGuards(JwtGuard)
 * @Get('profile')
 * getProfile(@CurrentUser() user: { userId: string, email: string }) {
 *   return { id: user.userId, email: user.email };
 * }
 *
 * Hoặc chỉ lấy userId:
 * @CurrentUser('userId') userId: string
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Nếu có data (VD: 'userId'), trả về field đó
    // Nếu không có data, trả về toàn bộ user object
    return data ? user?.[data] : user;
  },
);
