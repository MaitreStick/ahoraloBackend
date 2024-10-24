import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  action: string; 

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'jsonb', nullable: true })
  old_value: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  new_value: Record<string, any>;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
