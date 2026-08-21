import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { ChatbotService } from './chatbot.service';
import { Respuesta } from '../respuesta/entities/respuesta.entity';
import { PalabraClave } from '../palabra-clave/entities/palabra-clave.entity';

describe('ChatbotService', () => {
  let service: ChatbotService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ChatbotService,
        // Mocks de los repositorios de TypeORM
        {
          provide: getRepositoryToken(Respuesta),
          useValue: { find: jest.fn() },
        },
        {
          provide: getRepositoryToken(PalabraClave),
          useValue: { find: jest.fn() },
        },
        // Mock de HttpService (llamada a DeepSeek)
        {
          provide: HttpService,
          useValue: { post: jest.fn() },
        },
        // Mock de ConfigService (.env)
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ChatbotService>(ChatbotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('responde con los datos de la BD cuando hay coincidencia y no hay API key', async () => {
    const palabraClaveRepo = module.get(getRepositoryToken(PalabraClave));
    palabraClaveRepo.find.mockResolvedValue([
      {
        id: 1,
        palabras: 'pago',
        respuesta: {
          id: 1,
          respuesta: 'Información de pagos',
          categoria: { nombre: 'Pagos' },
        },
      },
    ]);

    // Sin API key configurada (placeholder) -> responde con la BD directamente
    const configService = module.get(ConfigService);
    configService.get.mockReturnValue('TU_API_KEY_AQUI');

    const resultado = await service.preguntar('¿Cómo hago un pago?');

    expect(resultado).toEqual({
      respuesta: 'Información de pagos',
      categoria: 'Pagos',
    });
  });

  it('usa DeepSeek para redactar la respuesta SOLO con los datos de la BD cuando hay coincidencia', async () => {
    const palabraClaveRepo = module.get(getRepositoryToken(PalabraClave));
    palabraClaveRepo.find.mockResolvedValue([
      {
        id: 1,
        palabras: 'pago',
        respuesta: {
          id: 1,
          respuesta: 'Información de pagos',
          categoria: { nombre: 'Pagos' },
        },
      },
    ]);

    const configService = module.get(ConfigService);
    configService.get.mockImplementation((key: string) =>
      key === 'DEEPSEEK_API_KEY'
        ? 'sk-test'
        : 'https://api.deepseek.com/chat/completions',
    );

    const httpService = module.get(HttpService);
    // 1ª llamada: DeepSeek interpreta el mensaje y elige el tema (id 1)
    httpService.post
      .mockReturnValueOnce(
        of({
          data: { choices: [{ message: { content: '{"id": 1}' } }] },
        }),
      )
      // 2ª llamada: DeepSeek redacta la respuesta con los datos de la BD
      .mockReturnValueOnce(
        of({
          data: {
            choices: [{ message: { content: 'Puedes pagar por la plataforma.' } }],
          },
        }),
      );

    const resultado = await service.preguntar('¿Cómo hago un pago?');

    expect(httpService.post).toHaveBeenCalledTimes(2);
    expect(resultado).toEqual({
      respuesta: 'Puedes pagar por la plataforma.',
      categoria: 'Pagos',
    });
  });

  it('rechaza la pregunta fuera de alcance SIN llamar a DeepSeek cuando no hay API key', async () => {
    const palabraClaveRepo = module.get(getRepositoryToken(PalabraClave));
    palabraClaveRepo.find.mockResolvedValue([]);

    const httpService = module.get(HttpService);
    httpService.post.mockReturnValue(
      of({ data: { choices: [{ message: { content: 'NO DEBE USARSE' } }] } }),
    );

    const resultado = await service.preguntar('¿quién ganó el mundial?');

    // Sin API key DeepSeek no se llama (no hay costo ni riesgo)
    expect(httpService.post).not.toHaveBeenCalled();
    expect(resultado.respuesta).toContain('no puedo responder');
    expect(resultado.categoria).toBeNull();
  });

  // ==========================================
  // CAMBIO: conversación social (saludos, ayuda, gracias, despedidas)
  // ==========================================

  it('responde a un saludo sin llamar a DeepSeek', async () => {
    const palabraClaveRepo = module.get(getRepositoryToken(PalabraClave));
    palabraClaveRepo.find.mockResolvedValue([]);

    const httpService = module.get(HttpService);
    httpService.post.mockReturnValue(of({ data: {} }));

    const resultado = await service.preguntar('¡Hola!');

    expect(resultado.respuesta).toContain('Hola');
    expect(resultado.categoria).toBe('Conversación');
    expect(httpService.post).not.toHaveBeenCalled();
  });

  it('responde a un saludo con error ortográfico ("holaa")', async () => {
    const palabraClaveRepo = module.get(getRepositoryToken(PalabraClave));
    palabraClaveRepo.find.mockResolvedValue([]);

    const resultado = await service.preguntar('holaa, buenas');

    expect(resultado.respuesta).toContain('Hola');
    expect(resultado.categoria).toBe('Conversación');
  });

  it('responde a una petición de ayuda', async () => {
    const palabraClaveRepo = module.get(getRepositoryToken(PalabraClave));
    palabraClaveRepo.find.mockResolvedValue([]);

    const resultado = await service.preguntar('me puedes ayudar?');

    expect(resultado.respuesta).toContain('puedo ayudarte');
    expect(resultado.respuesta).toContain('Pagos');
    expect(resultado.categoria).toBe('Conversación');
  });

  it('responde a un agradecimiento', async () => {
    const palabraClaveRepo = module.get(getRepositoryToken(PalabraClave));
    palabraClaveRepo.find.mockResolvedValue([]);

    const resultado = await service.preguntar('muchas gracias!');

    expect(resultado.respuesta).toContain('De nada');
    expect(resultado.categoria).toBe('Conversación');
  });

  it('responde a una despedida', async () => {
    const palabraClaveRepo = module.get(getRepositoryToken(PalabraClave));
    palabraClaveRepo.find.mockResolvedValue([]);

    const resultado = await service.preguntar('hasta luego');

    expect(resultado.respuesta).toContain('Hasta luego');
    expect(resultado.categoria).toBe('Conversación');
  });

  it('prioriza la pregunta del dominio aunque el mensaje empiece con saludo', async () => {
    const palabraClaveRepo = module.get(getRepositoryToken(PalabraClave));
    palabraClaveRepo.find.mockResolvedValue([
      {
        id: 1,
        palabras: 'pago',
        respuesta: {
          id: 1,
          respuesta: 'Información de pagos',
          categoria: { nombre: 'Pagos' },
        },
      },
    ]);

    const resultado = await service.preguntar('hola, ¿cómo hago un pago?');

    expect(resultado.respuesta).toBe('Información de pagos');
    expect(resultado.categoria).toBe('Pagos');
  });

  // ==========================================
  // CAMBIO: tolerancia a errores ortográficos sin IA
  // ==========================================

  it('entiende una palabra clave con error ortográfico sin usar IA ("mensualid")', async () => {
    const palabraClaveRepo = module.get(getRepositoryToken(PalabraClave));
    palabraClaveRepo.find.mockResolvedValue([
      {
        id: 1,
        palabras: 'mensualidad',
        respuesta: {
          id: 1,
          respuesta: 'Información de mensualidades',
          categoria: { nombre: 'Pagos' },
        },
      },
    ]);

    const httpService = module.get(HttpService);
    httpService.post.mockReturnValue(
      of({ data: { choices: [{ message: { content: 'NO DEBE USARSE' } }] } }),
    );

    // Sin API key: no hay llamada a DeepSeek, la tolerancia local lo resuelve
    const resultado = await service.preguntar('quiero saber la mensualid');

    expect(resultado).toEqual({
      respuesta: 'Información de mensualidades',
      categoria: 'Pagos',
    });
    expect(httpService.post).not.toHaveBeenCalled();
  });

  // ==========================================
  // CAMBIO: DeepSeek entiende el mensaje y elige el tema
  // ==========================================

  it('usa DeepSeek para entender un mensaje mal escrito y elegir el tema correcto', async () => {
    const palabraClaveRepo = module.get(getRepositoryToken(PalabraClave));
    palabraClaveRepo.find.mockResolvedValue([
      {
        id: 1,
        palabras: 'pago',
        respuesta: {
          id: 1,
          respuesta: 'Información de pagos',
          categoria: { nombre: 'Pagos' },
        },
      },
    ]);

    const configService = module.get(ConfigService);
    configService.get.mockImplementation((key: string) =>
      key === 'DEEPSEEK_API_KEY'
        ? 'sk-test'
        : 'https://api.deepseek.com/chat/completions',
    );

    const httpService = module.get(HttpService);
    // 1ª llamada: DeepSeek clasifica el tema y devuelve el id 1
    httpService.post
      .mockReturnValueOnce(
        of({
          data: { choices: [{ message: { content: '{"id": 1}' } }] },
        }),
      )
      // 2ª llamada: DeepSeek redacta la respuesta con los datos de la BD
      .mockReturnValueOnce(
        of({
          data: {
            choices: [{ message: { content: 'Puedes abonar en la caja central.' } }],
          },
        }),
      );

    const resultado = await service.preguntar('como abono la matricula');

    expect(httpService.post).toHaveBeenCalledTimes(2);
    expect(resultado).toEqual({
      respuesta: 'Puedes abonar en la caja central.',
      categoria: 'Pagos',
    });
  });

  it('rechaza la pregunta cuando DeepSeek no encuentra ningún tema parecido', async () => {
    const palabraClaveRepo = module.get(getRepositoryToken(PalabraClave));
    palabraClaveRepo.find.mockResolvedValue([
      {
        id: 1,
        palabras: 'pago',
        respuesta: {
          id: 1,
          respuesta: 'Información de pagos',
          categoria: { nombre: 'Pagos' },
        },
      },
    ]);

    const configService = module.get(ConfigService);
    configService.get.mockImplementation((key: string) =>
      key === 'DEEPSEEK_API_KEY'
        ? 'sk-test'
        : 'https://api.deepseek.com/chat/completions',
    );

    const httpService = module.get(HttpService);
    // DeepSeek clasifica y decide que ningún tema coincide
    httpService.post.mockReturnValue(
      of({
        data: { choices: [{ message: { content: '{"id": null}' } }] },
      }),
    );

    const resultado = await service.preguntar('¿quién ganó el mundial?');

    expect(resultado.respuesta).toContain('no puedo responder');
    expect(resultado.categoria).toBeNull();
  });

  // ==========================================
  // CAMBIO: DeepSeek interpreta abreviaturas y jerga antes de consultar la BD
  // ==========================================

  it('interpreta "contactos de caños" como decanatos con DeepSeek y consulta la BD', async () => {
    const palabraClaveRepo = module.get(getRepositoryToken(PalabraClave));
    palabraClaveRepo.find.mockResolvedValue([
      {
        id: 1,
        palabras: 'decanato',
        respuesta: {
          id: 1,
          respuesta: 'Información de decanatos',
          categoria: { nombre: 'Decanatos' },
        },
      },
    ]);

    const configService = module.get(ConfigService);
    configService.get.mockImplementation((key: string) =>
      key === 'DEEPSEEK_API_KEY'
        ? 'sk-test'
        : 'https://api.deepseek.com/chat/completions',
    );

    const httpService = module.get(HttpService);
    // 1ª llamada: DeepSeek interpreta "caños" -> id del tema decanato
    httpService.post
      .mockReturnValueOnce(
        of({
          data: { choices: [{ message: { content: '{"id": 1}' } }] },
        }),
      )
      // 2ª llamada: DeepSeek redacta la respuesta con los datos de la BD
      .mockReturnValueOnce(
        of({
          data: {
            choices: [{ message: { content: 'Puedes contactar al decanato de tu carrera.' } }],
          },
        }),
      );

    const resultado = await service.preguntar('contactos de caños');

    expect(httpService.post).toHaveBeenCalledTimes(2);
    expect(resultado).toEqual({
      respuesta: 'Puedes contactar al decanato de tu carrera.',
      categoria: 'Decanatos',
    });
  });

  it('interpreta la abreviatura "contra" como contraseña (plataforma)', async () => {
    const palabraClaveRepo = module.get(getRepositoryToken(PalabraClave));
    palabraClaveRepo.find.mockResolvedValue([
      {
        id: 1,
        palabras: 'contraseña',
        respuesta: {
          id: 1,
          respuesta: 'Información de plataforma',
          categoria: { nombre: 'Plataforma' },
        },
      },
    ]);

    const configService = module.get(ConfigService);
    configService.get.mockImplementation((key: string) =>
      key === 'DEEPSEEK_API_KEY'
        ? 'sk-test'
        : 'https://api.deepseek.com/chat/completions',
    );

    const httpService = module.get(HttpService);
    // 1ª llamada: DeepSeek interpreta "contra" -> id del tema contraseña
    httpService.post
      .mockReturnValueOnce(
        of({
          data: { choices: [{ message: { content: '{"id": 1}' } }] },
        }),
      )
      // 2ª llamada: DeepSeek redacta la respuesta con los datos de la BD
      .mockReturnValueOnce(
        of({
          data: {
            choices: [{ message: { content: 'Usa la opción de recuperar contraseña.' } }],
          },
        }),
      );

    const resultado = await service.preguntar('no recuerdo mi contra');

    expect(httpService.post).toHaveBeenCalledTimes(2);
    expect(resultado).toEqual({
      respuesta: 'Usa la opción de recuperar contraseña.',
      categoria: 'Plataforma',
    });
  });
});
