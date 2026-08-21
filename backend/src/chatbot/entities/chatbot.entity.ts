import { Entity ,PrimaryGeneratedColumn,Column,OneToMany} from 'typeorm';
import { Consulta } from 'src/consulta/entities/consulta.entity';


@Entity('chatbots')
export class Chatbot {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @OneToMany(() => Consulta, consultas => consultas.chatbot)
    consultas: Consulta[];
} 
