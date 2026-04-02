/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Session, SessionDocument } from './schemas/session.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password, displayName, bio, phone } = registerDto;
    // kiểm tra trùng username và email trước khi tạo user mới
    const existingUsername = await this.usersService.findByUsername(username);
    if (existingUsername) {
      throw new ConflictException('Username đã tồn tại');
    }
    const existingEmail = await this.usersService.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('Email đã tồn tại');
    }
    // tạo user mới
    await this.usersService.create({
      username,
      email,
      password,
      displayName,
      bio,
      phone,
    });

    return null;
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    // tìm user theo username
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Username hoặc Password không chính xác');
    }
    // so sánh password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Username hoặc Password không chính xác');
    }
    // tạo access token
    const accessToken = this.jwtService.sign(
      { userId: user._id.toString() },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_TTL') || '30m',
      },
    );
    // tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    // lưu refresh token
    await this.sessionModel.create({
      userId: user._id,
      refreshToken,
      expiresAt,
    });

    return {
      message: 'Login successful',
      refreshToken,
      accessToken,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async refresh(refreshToken: string) {
    const session = await this.sessionModel
      .findOne({ refreshToken })
      .populate('userId')
      .exec();

    // kiểm tra refresh token hợp lệ
    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.expiresAt <= new Date()) {
      await session.deleteOne();
      throw new UnauthorizedException('Refresh token expired');
    }

    // tạo access token mới
    const user = session.userId as UserDocument;
    const accessToken = this.jwtService.sign(
      { userId: user._id.toString() },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_TTL') || '30m',
      },
    );

    return { accessToken };
  }

  async logout(refreshToken: string) {
    await this.sessionModel.deleteOne({ refreshToken });
    return { message: 'Logout successful' };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      phone: user.phone,
    };
  }

  async getUserById(userId: string) {
    const user = await this.usersService.findOne(userId);
    return {
      id: user._id.toString(),
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    };
  }
}
