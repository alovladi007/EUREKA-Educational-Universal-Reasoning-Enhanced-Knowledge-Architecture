import { ConfigService } from '@nestjs/config';

const DEV_JWT_SECRET = 'default-secret-change-me';

/**
 * Resolve the JWT secret, refusing the weak dev fallback in production.
 *
 * The whole platform shares one HMAC secret for cross-service SSO, so a
 * leaked/known secret lets an attacker forge tokens that every service
 * accepts. In production we require a strong, explicitly-set JWT_SECRET;
 * dev/test keep the convenient default.
 */
export function resolveJwtSecret(config: ConfigService): string {
  const secret = config.get<string>('JWT_SECRET');
  if (
    process.env.NODE_ENV === 'production' &&
    (!secret || secret === DEV_JWT_SECRET)
  ) {
    throw new Error(
      'JWT_SECRET must be set to a strong, non-default value in production',
    );
  }
  return secret || DEV_JWT_SECRET;
}
