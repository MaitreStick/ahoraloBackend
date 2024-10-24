import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async createLog(action: string, user: User, oldValue: any, newValue: any, ipAddress: string): Promise<void> {
    console.log('Iniciando registro de auditoría');
    try {
      const log = this.auditLogRepository.create({
        action,
        user_id: user.id,
        old_value: oldValue,
        new_value: newValue,
        ip_address: ipAddress,
      });
  
      await this.auditLogRepository.save(log);
      console.log('Registro de auditoría guardado con éxito');
    } catch (error) {
      console.error('Error al guardar en la tabla de auditoría:', error);
    }
  }
  
}
