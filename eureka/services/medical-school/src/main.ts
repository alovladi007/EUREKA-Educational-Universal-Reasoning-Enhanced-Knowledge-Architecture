import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'http://localhost:4500',
    ],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API Prefix
  app.setGlobalPrefix('api/v1');

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('EUREKA Medical Education API')
    .setDescription(
      'Complete medical education platform with QBank, AI Tutor, Clinical Cases, and OSCE assessments',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication and user management')
    .addTag('qbank', 'Question bank and practice sessions')
    .addTag('items', 'Question item management')
    .addTag('ai-tutor', 'AI tutoring with Claude')
    .addTag('analytics', 'Performance analytics and IRT')
    .addTag('health', 'Service health checks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 8100;
  await app.listen(port);

  console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║   EUREKA Medical Education Platform                    ║
  ║   🏥 Medical QBank | 🤖 AI Tutor | 📊 Analytics       ║
  ╠════════════════════════════════════════════════════════╣
  ║   API: http://localhost:${port}/api/v1                 ║
  ║   Docs: http://localhost:${port}/docs                  ║
  ║   Health: http://localhost:${port}/api/v1/health       ║
  ╚════════════════════════════════════════════════════════╝

  Features:
  - ✅ Medical Question Bank with IRT scoring
  - ✅ AI Tutor powered by Claude (Anthropic)
  - ✅ Performance Analytics by organ system
  - ✅ Practice Modes: Tutor, Timed, Test
  - ✅ JWT Authentication & RBAC

  Ready for connections!
  `);
}

bootstrap();
