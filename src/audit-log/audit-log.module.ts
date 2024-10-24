import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogService } from './audit-log.service';
import { AuditLog } from './entities/audit-log.entity';
import { Prodcomcity } from 'src/prodcomcity/entities/prodcomcity.entity';
import { AuditLogController } from './audit-log.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, Prodcomcity]), 
  ],
  providers: [AuditLogService],
  controllers: [AuditLogController],
  exports: [AuditLogService], 
})
export class AuditLogModule {}
