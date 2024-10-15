import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseSessionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const userId = request.user?.id;

    if (!userId) {
      return next.handle();
    }

    return new Observable((observer) => {
      this.dataSource.transaction(async (manager) => {
        // Establecer la variable de sesión
        await manager.query(`SELECT set_config('app.current_user_id', $1, true)`, [userId.toString()]);

        // Añadir el manager al request
        request.manager = manager;

        try {
          const result = await next.handle().toPromise();
          observer.next(result);
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      });
    });
  }
}
