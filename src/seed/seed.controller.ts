import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

 @Get()
 @ApiBearerAuth('JWT-auth')
 @Auth( ValidRoles.superUser, ValidRoles.admin)
 executeSeed() {
  return this.seedService.runSeed()
 }
}
