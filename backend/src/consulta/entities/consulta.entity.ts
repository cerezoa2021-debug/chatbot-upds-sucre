import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Chatbot } from 'src/chatbot/entities/chatbot.entity';

@Entity('consultas')
export class Consulta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  mensaje: string;

  // CAMBIO: se guarda tambien la respuesta que dio el bot, para poder
  // revisar despues la calidad de las respuestas y armar metricas.
  @Column({ type: 'text', nullable: true })
  respuesta: string;

  // CAMBIO: categoria detectada (o null si no se encontro ningun tema),
  // util para saber cuales son los temas mas consultados por los alumnos.
  @Column({ nullable: true })
  categoria: string;

  // CAMBIO: fecha de creacion automatica, para poder ordenar el historial
  // y filtrar por rango de fechas en reportes.
  @CreateDateColumn()
  creadoEn: Date;

  @ManyToOne(() => Chatbot, (chatbot) => chatbot.consultas, { nullable: true })
  chatbot: Chatbot;
}
