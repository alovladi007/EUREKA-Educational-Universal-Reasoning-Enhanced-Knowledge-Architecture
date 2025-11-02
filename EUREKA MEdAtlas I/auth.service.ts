import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { UserSession } from '../entities/user-session.entity';
import { RegisterDto, LoginDto, RefreshTokenDto } from '../dto/auth.dto';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
  org_id: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    org_id: string;
    avatar_url?: string;
  };
  tokens: AuthTokens;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSession)
    private readonly sessionRepository: Repository<UserSession>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    const { email, password, first_name, last_name, org_id, role = 'student' } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate password strength
    this.validatePassword(password);

    // Hash password
    const password_hash = await this.hashPassword(password);

    // Create user
    const user = this.userRepository.create({
      email,
      password_hash,
      first_name,
      last_name,
      org_id,
      role,
      email_verified: false, // Require email verification in production
      is_active: true,
      settings: {},
    });

    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user, ipAddress, userAgent);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password_hash', 'first_name', 'last_name', 'role', 'org_id', 'is_active', 'avatar_url'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new UnauthorizedException('Account is disabled');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.userRepository.update(user.id, { last_login_at: new Date() });

    // Generate tokens
    const tokens = await this.generateTokens(user, ipAddress, userAgent);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto, ipAddress?: string): Promise<AuthTokens> {
    const { refresh_token } = refreshTokenDto;

    // Find session
    const session = await this.sessionRepository.findOne({
      where: { refresh_token },
      relations: ['user'],
    });

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if session expired
    if (new Date() > session.expires_at) {
      await this.sessionRepository.delete(session.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    // Verify token
    try {
      const payload = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Generate new tokens
      const newTokens = await this.generateTokens(session.user, ipAddress, session.user_agent);

      // Delete old session
      await this.sessionRepository.delete(session.id);

      return newTokens;
    } catch (error) {
      await this.sessionRepository.delete(session.id);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user (invalidate refresh token)
   */
  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await this.sessionRepository.delete({ refresh_token: refreshToken });
    } else {
      // Logout from all devices
      await this.sessionRepository.delete({ user_id: userId });
    }
  }

  /**
   * Verify access token
   */
  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Change password
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password_hash'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    // Validate new password
    this.validatePassword(newPassword);

    // Hash new password
    const password_hash = await this.hashPassword(newPassword);

    // Update password
    await this.userRepository.update(userId, { password_hash });

    // Invalidate all sessions (force re-login)
    await this.sessionRepository.delete({ user_id: userId });
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // In production, generate reset token and send email
    // For now, just log
    console.log(`Password reset requested for ${email}`);
    // TODO: Implement email service to send reset link
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // In production, verify reset token
    // For now, just validate password
    this.validatePassword(newPassword);
    
    // TODO: Implement token verification and password update
    throw new BadRequestException('Password reset not yet implemented');
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(user: User, ipAddress?: string, userAgent?: string): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      org_id: user.org_id,
    };

    // Generate access token (short-lived)
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });

    // Generate refresh token (long-lived)
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    // Calculate expiration date for refresh token
    const expiresInSeconds = this.parseExpirationTime(process.env.JWT_REFRESH_EXPIRES_IN || '7d');
    const expires_at = new Date(Date.now() + expiresInSeconds * 1000);

    // Store refresh token in database
    const session = this.sessionRepository.create({
      user_id: user.id,
      refresh_token,
      ip_address: ipAddress,
      user_agent: userAgent,
      expires_at,
    });

    await this.sessionRepository.save(session);

    return {
      access_token,
      refresh_token,
      expires_in: this.parseExpirationTime(process.env.JWT_EXPIRES_IN || '15m'),
    };
  }

  /**
   * Hash password using bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Validate password strength
   */
  private validatePassword(password: string): void {
    if (!password || password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    // Check for at least one uppercase, one lowercase, one number
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      throw new BadRequestException(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      );
    }
  }

  /**
   * Remove sensitive data from user object
   */
  private sanitizeUser(user: User): any {
    const { password_hash, deleted_at, ...sanitized } = user as any;
    return sanitized;
  }

  /**
   * Parse expiration time string to seconds
   */
  private parseExpirationTime(expiration: string): number {
    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error('Invalid expiration format');
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        throw new Error('Invalid time unit');
    }
  }
}
