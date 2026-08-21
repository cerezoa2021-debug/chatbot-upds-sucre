import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // CAMBIO: se crea la app como NestExpressApplication para poder
  // servir archivos estáticos (la interfaz gráfica del chat).
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CAMBIO: habilita CORS para que el frontend pueda consumir el chatbot
  app.enableCors();

  // CAMBIO: sirve la carpeta public/ en la raíz del servidor.
  // Con esto, al abrir http://localhost:3000 en el navegador se ve
  // la interfaz gráfica del chat (public/index.html) y se puede
  // preguntar al bot sin usar curl ni Postman.
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
