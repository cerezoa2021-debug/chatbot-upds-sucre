import { Test, TestingModule } from '@nestjs/testing';
import { PalabraClaveService } from './palabra-clave.service';

describe('PalabraClaveService', () => {
  let service: PalabraClaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PalabraClaveService],
    }).compile();

    service = module.get<PalabraClaveService>(PalabraClaveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
