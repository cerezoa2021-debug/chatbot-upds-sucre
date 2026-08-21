import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consulta } from './entities/consulta.entity';
import { ConsultaService } from './consulta.service';
import { ConsultaController } from './consulta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Consulta])],
  controllers: [ConsultaController],
  providers: [ConsultaService],
})
export class ConsultaModule {}
