import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PalabraClave } from './entities/palabra-clave.entity';
import { PalabraClaveService } from './palabra-clave.service';
import { PalabraClaveController } from './palabra-clave.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PalabraClave])],
  controllers: [PalabraClaveController],
  providers: [PalabraClaveService],
})
export class PalabraClaveModule {}
