import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { Response } from 'express';

@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async getAuditLogs(
    @Query('user') user?: string,
    @Query('action') action?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.auditLogService.findAuditLogs(user, action, page, limit);
  }

  @Get('/export')
  async exportAuditLogs(
    @Res() res: Response,
    @Query('format') format: string,
    @Query('user') user?: string,
    @Query('action') action?: string,
  ) {
    const logs = await this.auditLogService.findAuditLogs(user, action);

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=audit_logs.csv');
      return res.send(this.auditLogService.toCSV(logs));
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=audit_logs.json');
    return res.json(logs);
  }
}
