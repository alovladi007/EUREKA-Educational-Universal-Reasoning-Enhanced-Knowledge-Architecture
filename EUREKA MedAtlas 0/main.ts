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
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
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
    .setTitle('MedAtlas QBank API')
    .setDescription(
      'Question Bank service with Item Response Theory (IRT) scoring and analytics',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('items', 'Question item management')
    .addTag('responses', 'User responses and scoring')
    .addTag('analytics', 'Performance analytics and IRT')
    .addTag('health', 'Service health checks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 8001;
  await app.listen(port);
  
  console.log(`
  ╔════════════════════════════════════════════╗
  ║   MedAtlas QBank Service                   ║
  ║   🎯 Question Bank with IRT Scoring        ║
  ╠════════════════════════════════════════════╣
  ║   API: http://localhost:${port}/api/v1      ║
  ║   Docs: http://localhost:${port}/docs      ║
  ║   Health: http://localhost:${port}/health  ║
  ╚════════════════════════════════════════════╝
  `);
}

bootstrap();
