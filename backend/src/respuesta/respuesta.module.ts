import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Respuesta } from './entities/respuesta.entity';
import { RespuestaService } from './respuesta.service';
import { RespuestaController } from './respuesta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Respuesta])],
  controllers: [RespuestaController],
  providers: [RespuestaService],
})
export class RespuestaModule {}
