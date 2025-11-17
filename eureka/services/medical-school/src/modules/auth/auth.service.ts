import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';

// Note: This service expects User and UserSession entities to exist in the database
// For now, we're creating a simplified version that will be enhanced when entities are added

@Injectable()
export class AuthService {
  private readonly jwtExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.jwtExpiresIn = this.configService.get('JWT_EXPIRES_IN', '15m');
    this.refreshExpiresIn = this.configService.get('REFRESH_TOKEN_EXPIRES_IN', '7d');
  }

  async register(registerDto: RegisterDto, ipAddress: string, userAgent: string) {
    // Hash password
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    // In a real implementation, you would:
    // 1. Check if user exists
    // 2. Create user in database
    // 3. Create session
    // 4. Generate tokens

    // For now, creating mock response
    const user = {
      id: this.generateUUID(),
      email: registerDto.email,
      first_name: registerDto.first_name,
      last_name: registerDto.last_name,
      role: registerDto.role || 'student',
      org_id: registerDto.org_id,
    };

    const tokens = await this.generateTokens(user);

    return {
      user,
      tokens,
    };
  }

  async login(loginDto: LoginDto, ipAddress: string, userAgent: string) {
    // In a real implementation, you would:
    // 1. Find user by email
    // 2. Verify password with bcrypt.compare()
    // 3. Create session
    // 4. Generate tokens

    // Mock implementation for demo
    const user = {
      id: '10000000-0000-0000-0000-000000000003',
      email: loginDto.email,
      first_name: 'Medical',
      last_name: 'Student',
      role: 'student',
      org_id: '00000000-0000-0000-0000-000000000001',
    };

    const tokens = await this.generateTokens(user);

    return {
      user,
      tokens,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto, ipAddress: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshTokenDto.refresh_token);

      // In a real implementation:
      // 1. Check if refresh token exists in database
      // 2. Check if it's not expired
      // 3. Generate new tokens
      // 4. Rotate refresh token

      const user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        org_id: payload.org_id,
      };

      return await this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string, refreshToken?: string) {
    // In a real implementation:
    // 1. If refreshToken provided, invalidate that specific token
    // 2. If no refreshToken, invalidate all user sessions
    // 3. Delete from database

    return { message: 'Logged out successfully' };
  }

  async getUserById(userId: string) {
    // In a real implementation, fetch from database
    // For now, return mock user
    return {
      id: userId,
      email: 'student@university.edu',
      first_name: 'Medical',
      last_name: 'Student',
      role: 'student',
      org_id: '00000000-0000-0000-0000-000000000001',
      is_active: true,
      email_verified: true,
      created_at: new Date(),
    };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    // In a real implementation:
    // 1. Get user from database
    // 2. Verify old password with bcrypt.compare()
    // 3. Hash new password
    // 4. Update in database
    // 5. Invalidate all sessions except current

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    return { message: 'Password changed successfully' };
  }

  async requestPasswordReset(email: string) {
    // In a real implementation:
    // 1. Find user by email
    // 2. Generate reset token (crypto.randomBytes)
    // 3. Store token with expiry in database
    // 4. Send email with reset link

    return { message: 'Password reset email sent if account exists' };
  }

  async resetPassword(token: string, newPassword: string) {
    // In a real implementation:
    // 1. Verify token exists and not expired
    // 2. Hash new password
    // 3. Update user password
    // 4. Delete reset token
    // 5. Invalidate all sessions

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    return { message: 'Password reset successfully' };
  }

  // Helper Methods

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      org_id: user.org_id,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.refreshExpiresIn,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.parseExpiresIn(this.jwtExpiresIn),
      token_type: 'Bearer',
    };
  }

  private parseExpiresIn(expiresIn: string): number {
    // Convert "15m", "7d", etc. to seconds
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // default 15 minutes

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 900;
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
