import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PalabraClaveService } from './palabra-clave.service';
import { CreatePalabraClaveDto } from './dto/create-palabra-clave.dto';
import { UpdatePalabraClaveDto } from './dto/update-palabra-clave.dto';

@Controller('palabra-clave')
export class PalabraClaveController {
  constructor(private readonly palabraClaveService: PalabraClaveService) {}

  @Post()
  create(@Body() createPalabraClaveDto: CreatePalabraClaveDto) {
    return this.palabraClaveService.create(createPalabraClaveDto);
  }

  @Get()
  findAll() {
    return this.palabraClaveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.palabraClaveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePalabraClaveDto: UpdatePalabraClaveDto) {
    return this.palabraClaveService.update(+id, updatePalabraClaveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.palabraClaveService.remove(+id);
  }
}
