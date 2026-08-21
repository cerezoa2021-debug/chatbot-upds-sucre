import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { Chatbot } from './entities/chatbot.entity';
// cambios 

import { Respuesta } from '../respuesta/entities/respuesta.entity';
import { PalabraClave } from '../palabra-clave/entities/palabra-clave.entity';
import { Categoria } from '../categoria/entities/categoria.entity';
import { Consulta } from '../consulta/entities/consulta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Chatbot,
      Respuesta,
      PalabraClave,
      Categoria,
      Consulta,
    ]),
  ],

  controllers: [ChatbotController],

  providers: [ChatbotService],
})
export class ChatbotModule {}
