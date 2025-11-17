import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { ItemsModule } from './modules/items/items.module';
import { AITutorModule } from './modules/ai-tutor/ai-tutor.module';
import { CasesModule } from './modules/cases/cases.module';
import { OSCEModule } from './modules/osce/osce.module';
import { ContentModule } from './modules/content/content.module';
import { AssetsModule } from './modules/assets/assets.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database - Disabled for in-memory storage
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     url: configService.get('DATABASE_URL'),
    //     autoLoadEntities: true,
    //     synchronize: configService.get('NODE_ENV') === 'development',
    //     logging: configService.get('NODE_ENV') === 'development',
    //     ssl:
    //       configService.get('NODE_ENV') === 'production'
    //         ? { rejectUnauthorized: false }
    //         : false,
    //   }),
    //   inject: [ConfigService],
    // }),

    // Business Modules
    AuthModule,
    ItemsModule,
    AITutorModule,
    CasesModule, // Now using in-memory storage
    OSCEModule, // Clinical skills assessment
    ContentModule, // Content Studio - authoring & curriculum
    AssetsModule, // Media storage with MinIO/S3
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
