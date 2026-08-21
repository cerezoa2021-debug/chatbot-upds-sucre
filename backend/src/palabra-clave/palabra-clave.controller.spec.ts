import { Test, TestingModule } from '@nestjs/testing';
import { PalabraClaveController } from './palabra-clave.controller';
import { PalabraClaveService } from './palabra-clave.service';

describe('PalabraClaveController', () => {
  let controller: PalabraClaveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PalabraClaveController],
      providers: [PalabraClaveService],
    }).compile();

    controller = module.get<PalabraClaveController>(PalabraClaveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
