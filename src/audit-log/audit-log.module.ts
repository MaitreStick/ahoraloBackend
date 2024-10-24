import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogService } from './audit-log.service';
import { AuditLog } from './entities/audit-log.entity';
import { Prodcomcity } from 'src/prodcomcity/entities/prodcomcity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, Prodcomcity]), 
  ],
  providers: [AuditLogService],
  exports: [AuditLogService], 
})
export class AuditLogModule {}
