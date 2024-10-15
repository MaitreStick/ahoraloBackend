import { PartialType } from '@nestjs/swagger';
import { CreateComcityDto } from './create-comcity.dto';

export class UpdateComcityDto extends PartialType(CreateComcityDto) {}
