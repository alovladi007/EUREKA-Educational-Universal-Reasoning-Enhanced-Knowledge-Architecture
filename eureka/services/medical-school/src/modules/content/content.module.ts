import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './services/content.service';

@Module({
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {
  constructor() {
    console.log('🎯 ContentModule initialized!');
  }
}
