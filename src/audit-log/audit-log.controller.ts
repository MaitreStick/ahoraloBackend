import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuditLogService } from './audit-log.service';
import { Response } from 'express';

@ApiTags('Audit Logs')
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of audit logs' })
  @ApiQuery({ name: 'user', type: 'string', required: false, description: 'User ID filter' })
  @ApiQuery({ name: 'action', type: 'string', required: false, description: 'Action filter' })
  @ApiQuery({ name: 'page', type: 'number', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', type: 'number', required: false, description: 'Number of logs per page', example: 10 })
  @ApiResponse({ status: 200, description: 'List of audit logs' })
  async getAuditLogs(
    @Query('user') user?: string,
    @Query('action') action?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.auditLogService.findAuditLogs(user, action, page, limit);
  }

  @Get('/export')
  @ApiOperation({ summary: 'Export audit logs in CSV or JSON format' })
  @ApiQuery({ name: 'format', type: 'string', required: true, description: 'Export format (csv or json)', example: 'csv' })
  @ApiQuery({ name: 'user', type: 'string', required: false, description: 'User ID filter' })
  @ApiQuery({ name: 'action', type: 'string', required: false, description: 'Action filter' })
  @ApiResponse({ status: 200, description: 'Exported audit logs file' })
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
