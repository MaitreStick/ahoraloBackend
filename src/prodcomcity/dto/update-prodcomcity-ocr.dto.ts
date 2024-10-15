import { PartialType } from '@nestjs/swagger';
import { CreateProdcomcityOcrDto } from './create-prodcomcity-ocr.dto';

export class UpdateProdcomcityOcrDto extends PartialType(CreateProdcomcityOcrDto) {}