import { Injectable } from '@nestjs/common';
import { CreatePalabraClaveDto } from './dto/create-palabra-clave.dto';
import { UpdatePalabraClaveDto } from './dto/update-palabra-clave.dto';

@Injectable()
export class PalabraClaveService {
  create(createPalabraClaveDto: CreatePalabraClaveDto) {
    return 'This action adds a new palabraClave';
  }

  findAll() {
    return `This action returns all palabraClave`;
  }

  findOne(id: number) {
    return `This action returns a #${id} palabraClave`;
  }

  update(id: number, updatePalabraClaveDto: UpdatePalabraClaveDto) {
    return `This action updates a #${id} palabraClave`;
  }

  remove(id: number) {
    return `This action removes a #${id} palabraClave`;
  }
}
