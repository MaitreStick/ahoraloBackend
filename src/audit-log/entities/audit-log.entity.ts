import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier of the audit log',
    type: 'string',
    format: 'uuid',
    example: 'bb3d7cbac2174dd30fe5e787131d951799abdd84',
  })
  id: string;

  @Column({ type: 'varchar', length: 10 })
  @ApiProperty({
    description: 'Action performed by the user (e.g., create, update, delete)',
    type: 'string',
    maxLength: 10,
    example: 'create',
  })
  action: string; 

  @Column({ type: 'uuid' })
  @ApiProperty({
    description: 'ID of the user who performed the action',
    type: 'string',
    format: 'uuid',
    example: 'a1f3c93b-62d7-4a6f-a16b-5e2f8de5a75d',
  })
  user_id: string;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({
    description: 'Previous value of the record before the action',
    type: 'object',
    example: { name: 'John Doe', age: 30 },
    nullable: true,
  })
  old_value: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({
    description: 'New value of the record after the action',
    type: 'object',
    example: { name: 'Jane Doe', age: 31 },
    nullable: true,
  })
  new_value: Record<string, any>;

  @Column({ type: 'varchar', length: 45, nullable: true })
  @ApiProperty({
    description: 'IP address from which the action was performed',
    type: 'string',
    format: 'ipv4',
    example: '192.168.0.1',
    nullable: true,
  })
  ip_address: string;

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    description: 'Timestamp when the audit log was created',
    type: 'string',
    format: 'date-time',
    example: '2024-10-25T14:48:00.000Z',
  })
  created_at: Date;
}
