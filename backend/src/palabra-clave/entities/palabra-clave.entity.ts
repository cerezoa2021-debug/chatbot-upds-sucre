import { Entity,PrimaryGeneratedColumn,Column,ManyToOne } from 'typeorm';
import { Respuesta } from '../../respuesta/entities/respuesta.entity';
@Entity('palabras_clave')
export class PalabraClave {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    palabras: string;
    @ManyToOne(() => Respuesta, respuesta => respuesta.palabrasClave)
    respuesta: Respuesta;
}
