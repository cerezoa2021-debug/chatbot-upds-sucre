import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { Respuesta } from '../respuesta/entities/respuesta.entity';
import { PalabraClave } from '../palabra-clave/entities/palabra-clave.entity';

describe('ChatbotController', () => {
  let controller: ChatbotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatbotController],
      providers: [
        ChatbotService,
        // Mocks de las dependencias del ChatbotService
        {
          provide: getRepositoryToken(Respuesta),
          useValue: { find: jest.fn() },
        },
        {
          provide: getRepositoryToken(PalabraClave),
          useValue: { find: jest.fn() },
        },
        {
          provide: HttpService,
          useValue: { post: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ChatbotController>(ChatbotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
