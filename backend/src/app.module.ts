import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ConsultaModule } from './consulta/consulta.module';
import { CategoriaModule } from './categoria/categoria.module';
import { RespuestaModule } from './respuesta/respuesta.module';
import { PalabraClaveModule } from './palabra-clave/palabra-clave.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    // configuramos el ConfiModule de forma gloval y apuntamos a .env 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // typeORM lee las credenciales de .env y no hay usa valores por defecto
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '3306'), 10),
        username: config.get<string>('DB_USER', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'chatbot'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    // permite que el chatbot este en cualquiermodulo ya que es global
    HttpModule.register({ global: true }),

    ChatbotModule,
    ConsultaModule,
    CategoriaModule,
    RespuestaModule,
    PalabraClaveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
