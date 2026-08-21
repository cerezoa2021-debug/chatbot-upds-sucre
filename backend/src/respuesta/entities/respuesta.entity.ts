
import { Entity,PrimaryGeneratedColumn,Column,ManyToOne,OneToMany} from 'typeorm';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { PalabraClave } from 'src/palabra-clave/entities/palabra-clave.entity';    
@Entity('respuestas')
export class Respuesta {
    @PrimaryGeneratedColumn()
    id: number;

    //  la respuesta puede ser larga (teléfonos, horarios, procedimientos)
    // y VARCHAR(255) no alcanza; se usa TEXT para admitir textos extensos.
    @Column({ type: 'text' })
    respuesta: string;

    @ManyToOne(() => Categoria, categoria => categoria.respuesta)
    categoria: Categoria;

    @OneToMany(() => PalabraClave, palabraClave => palabraClave.respuesta)
    palabrasClave: PalabraClave[];
}
