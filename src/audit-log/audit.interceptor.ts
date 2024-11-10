import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from './audit-log.service';
import { Request } from 'express';
import { User } from 'src/auth/entities/user.entity';
import { Prodcomcity } from 'src/prodcomcity/entities/prodcomcity.entity';
import { City } from 'src/cities/entities/city.entity'; 
import { Company } from 'src/companies/entities/company.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly auditLogService: AuditLogService,
    @InjectRepository(Prodcomcity)
    private readonly prodcomcityRepository: Repository<Prodcomcity>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>, // Repositorio de City
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>, // Repositorio de Company
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as User;
    const { method, originalUrl } = req;
    const entityId = req.params.id;

    let oldValue = null;

    // Determinar la entidad basada en la URL
    if (originalUrl.includes('/prodcomcity/') && entityId) {
      oldValue = await this.prodcomcityRepository.findOneBy({ id: entityId });
    } else if (originalUrl.includes('/cities/') && entityId) {
      oldValue = await this.cityRepository.findOneBy({ id: entityId });
    } else if (originalUrl.includes('/companies/') && entityId) {
      oldValue = await this.companyRepository.findOneBy({ id: entityId });
    }

    return next.handle().pipe(
      tap(async (response: any) => {
        if (user && ['admin', 'super-user'].some(role => user.roles.includes(role))) {
          const action = this.getActionFromMethod(method);
          const newValue = ['POST', 'PUT', 'PATCH'].includes(method) ? req.body : null;
          const ipAddress = this.getRealIp(req);

          // Usar el valor retornado por el controlador como oldValue para DELETE
          const finalOldValue = method === 'DELETE' ? response || oldValue : oldValue;


          await this.auditLogService.createLog(action, user, finalOldValue, newValue, ipAddress);
        }
      }),
    );
  }

  private getActionFromMethod(method: string): string | null {
    switch (method) {
      case 'POST':
        return 'create';
      case 'PUT':
      case 'PATCH':
        return 'update';
      case 'DELETE':
        return 'delete';
      default:
        return null;
    }
  }

  private getRealIp(req: Request): string {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return xForwardedFor.toString().split(',')[0].trim();
    }
    return req.socket.remoteAddress || req.ip;
  }
}
