import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DatabaseSessionInterceptor } from './auth/interceptors/database-session.interceptor';
import { DataSource } from 'typeorm';
import { AuditLogInterceptor } from './audit-log/audit.interceptor';
import { AuditLogService } from './audit-log/audit-log.service';
import { Prodcomcity } from './prodcomcity/entities/prodcomcity.entity';
import { City } from './cities/entities/city.entity';
import { Company } from './companies/entities/company.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const auditLogService = app.get(AuditLogService);
  const prodcomcityRepository = dataSource.getRepository(Prodcomcity);
  const cityRepository = dataSource.getRepository(City);
  const companyRepository = dataSource.getRepository(Company); 

  app.useGlobalInterceptors(
    new AuditLogInterceptor(auditLogService, prodcomcityRepository, cityRepository, companyRepository),
  );
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('PriceTracker RESTFUL API')
    .setDescription('PriceTracker endpoints')
    .setVersion('1.0').addServer('http://localhost:8080/').addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(process.env.PORT);
  logger.log(`Application is running on port ${process.env.PORT}`);
}
bootstrap();
