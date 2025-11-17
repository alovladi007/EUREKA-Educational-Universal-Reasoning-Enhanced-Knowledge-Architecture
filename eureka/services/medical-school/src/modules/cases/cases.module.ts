import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
// import { Case } from '../../entities/case.entity';
// import { CaseSession } from '../../entities/case-session.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // TypeOrmModule.forFeature([Case, CaseSession]), // Disabled - using in-memory storage
    AuthModule,
  ],
  controllers: [CasesController],
  providers: [CasesService],
  exports: [CasesService],
})
export class CasesModule {}
