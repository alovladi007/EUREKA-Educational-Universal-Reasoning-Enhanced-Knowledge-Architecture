import { Module } from '@nestjs/common';
import { OSCEController } from './osce.controller';
import { OSCEService } from './osce.service';

@Module({
  controllers: [OSCEController],
  providers: [OSCEService],
  exports: [OSCEService],
})
export class OSCEModule {}
