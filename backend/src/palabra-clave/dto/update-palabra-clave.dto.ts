import { PartialType } from '@nestjs/mapped-types';
import { CreatePalabraClaveDto } from './create-palabra-clave.dto';

export class UpdatePalabraClaveDto extends PartialType(CreatePalabraClaveDto) {}
