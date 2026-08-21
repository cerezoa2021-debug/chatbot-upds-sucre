import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  // CAMBIO: endpoint POST /chatbot/preguntar
  // Recibe { "mensaje": "..." } y devuelve la respuesta del chatbot.
  @Post('preguntar')
  preguntar(@Body('mensaje') mensaje: string) {
    // CAMBIO: validación para no romper el servicio si el mensaje viene vacío
    if (!mensaje || !mensaje.trim()) {
      throw new BadRequestException('El campo mensaje es obligatorio');
    }

    return this.chatbotService.preguntar(mensaje);
  }
  
  @Get()
  findAll() {
    return this.chatbotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatbotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatbotDto: UpdateChatbotDto) {
    return this.chatbotService.update(+id, updateChatbotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatbotService.remove(+id);
  }
}
