import { PartialType } from '@nestjs/mapped-types';
import { CreateRespuestaDto } from './create-respuesta.dto';

export class UpdateRespuestaDto extends PartialType(CreateRespuestaDto) {}
