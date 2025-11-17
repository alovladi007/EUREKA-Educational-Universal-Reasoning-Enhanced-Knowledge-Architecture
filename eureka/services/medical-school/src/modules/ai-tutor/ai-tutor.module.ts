import { Module } from '@nestjs/common';
import { AITutorController } from './ai-tutor.controller';
import { AITutorService } from './ai-tutor.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AITutorController],
  providers: [AITutorService],
  exports: [AITutorService],
})
export class AITutorModule {}
