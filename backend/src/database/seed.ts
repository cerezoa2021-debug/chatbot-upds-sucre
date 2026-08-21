import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Categoria } from '../categoria/entities/categoria.entity';
import { Respuesta } from '../respuesta/entities/respuesta.entity';
import { PalabraClave } from '../palabra-clave/entities/palabra-clave.entity';
import { Chatbot } from '../chatbot/entities/chatbot.entity';
import { Consulta } from '../consulta/entities/consulta.entity';

/*
| Conexcion DB
*/
const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USER ?? '',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'chatbot',

  entities: [Categoria, Respuesta, PalabraClave, Chatbot, Consulta],

  synchronize: true,
});

async function seed() {
  try {
    await dataSource.initialize();

    console.log('Conectado a la base de datos');

    const categoriaRepository = dataSource.getRepository(Categoria);
    const respuestaRepository = dataSource.getRepository(Respuesta);
    const palabraClaveRepository = dataSource.getRepository(PalabraClave);    /*
    |--------------------------------------------------------------------------
    | LIMPIAR DATOS ANTERIORES
    |--------------------------------------------------------------------------
    | CAMBIO: MySQL no permite TRUNCATE en una tabla referenciada por una
    | clave foránea (palabras_clave.respuestaId -> respuestas.id). Por eso
    | se desactivan temporalmente las verificaciones de claves foráneas
    | mientras se limpian las tablas.
    */

    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');

    await palabraClaveRepository.clear();
    await respuestaRepository.clear();
    await categoriaRepository.clear();

    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Datos anteriores eliminados');

    /*
    CATEGORIAS

    contactos, decanatos, pagos, plataforma, aulas, sistema modular, atencion, servicios, estudiantes nuevos y datos personales.
    */

    const marketing = await categoriaRepository.save(
      categoriaRepository.create({
        nombre: 'Marketing',
        descripcion: 'Comunicación institucional y actividades',
      }),
    );

    const pagos = await categoriaRepository.save(
      categoriaRepository.create({
        nombre: 'Pagos',
        descripcion: 'Cajas, fechas límite y procedimientos de pago modaliad precencial como semiprecencial',
      }),
    );

    const plataforma = await categoriaRepository.save(
      categoriaRepository.create({
        nombre: 'Plataforma',
        descripcion: 'Funcionamiento de la plataforma universitaria y problemas de acceso',
      }),
    );

    const decanatos = await categoriaRepository.save(
      categoriaRepository.create({
        nombre: 'Decanatos',
        descripcion: 'Decanatos, responsables y contactos por facultad',
      }),
    );

    const aulas = await categoriaRepository.save(
      categoriaRepository.create({
        nombre: 'Aulas',
        descripcion: 'Otogar un link que redirige al portal academico del estudiante',
      }),
    );

    const sistemaModular = await categoriaRepository.save(
      categoriaRepository.create({
        nombre: 'Sistema Modular',
        descripcion: 'Funcionamiento del sistema modular',
      }),
    );

    const atencion = await categoriaRepository.save(
      categoriaRepository.create({
        nombre: 'Atención',
        descripcion: 'Horarios y servicios de atención universitaria',
      }),
    );

    const servicios = await categoriaRepository.save(
      categoriaRepository.create({
        nombre: 'Servicios',
        descripcion: 'Servicios de la universidad: biblioteca, deportes, etc.',
      }),
    );

    const informacionPersonal = await categoriaRepository.save(
      categoriaRepository.create({
        nombre: 'Información Personal',
        descripcion: 'Aclara que el chatbot no accede a datos personales',
      }),
    );

    const carreras = await categoriaRepository.save(
      categoriaRepository.create({
        nombre: 'Carreras',
        descripcion: 'Información sobre las carreras profesionales',
      }),
    );
    /*
      RESPUESTAS
    */

    const respuestaMarketing = await respuestaRepository.save(
      respuestaRepository.create({
        respuesta: `
          Área de Marketing
          Responsable: Lic. Andrés Cueto  (Asesor Comercial).
          Ubicación: Edificio Administrativo, planta baja 
          Celular: 74163220
          Horario de atención: lunes a viernes de 08:00 a 12:30 y de 15:00 a 19:30 Sábado: 8:30 a 12:30 
          Funciones: comunicación institucional, actividades, campañas y
          difusión de información universitaria. 

          Si quieres participar en una actividad, acércate a esta oficina.
        `.trim(),
        categoria: marketing,
      }),
    );

    const respuestaPagos = await respuestaRepository.save(
      respuestaRepository.create({
        respuesta: `
          Pagos y Cajas

          Caja Central:
          Ubicación: Planta baja del Edificio Administrativo.
          Celular: 69672492
          Horario: lunes a viernes de 08:00 a 12:30 y 15:00 a 19:30 .

          Medios de pago: efectivo, tarjeta de débito, depósito o transferencia bancaria.
          Se entrega comprobante de cada pago: conserva siempre tu recibo.

          Fechas límite de pago:
          - Matrícula: primera quincena del periodo correspondiente.
          - Cuotas mensuales: vencen el día 10 de cada mes.
          - Las fechas exactas se publican en el calendario académico oficial;
            consúltalo siempre antes de pagar.

          Procedimiento de pago:
          1. Acércate a la Caja Central con tu carnet universitario o cédula de identidad.
          2. Indica el concepto de pago (matrícula, cuota, arancel).
          3. Realiza el pago y conserva el comprobante.

          Si tienes deudas o mora, acude a la Caja para regularizar tu situación
          y evitar recargos.
        `.trim(),
        categoria: pagos,
      }),
    );

    const respuestaPlataforma = await respuestaRepository.save(
      respuestaRepository.create({
        respuesta: `
          Plataforma Universitaria

          sirve para que el estudiante pueda gestionar y consultar diferentes aspectos
          académicos. Entre sus funciones están consultar materias y horarios, 
          revisar calificaciones, acceder a información académica, realizar o consultar 
          actividades, revisar comunicados, gestionar procesos relacionados con la inscripción 
          y matrícula y acceder a recursos o servicios que la universidad pone a disposición 
          de los estudiantes.

          Entrega de Trabajos: los estudiantes pueden subir sus tareas y trabajos
          se entregan mediante la plataforma universitaria virtual, dentro de la materia correspondiente. 
          El docente publica la actividad, indica las instrucciones y la fecha límite,
          y el estudiante debe subir allí el archivo o trabajo solicitado.

          Ingreso: utiliza tu usuario y contraseña proporcionados por la universidad.
          ¿Olvidaste tu contraseña? Usa la opción "¿Olvidaste tu contraseña?" en la
          página de inicio de la plataforma.

          Problemas para iniciar sesión: comunícate con el ing Ignacio Vaca 
          (Teléfono: 77040459 , correo: jose.vaca@upds.edu.bo)
          o con el área de sistemas.

          Para cambiar tu contraseña puedes hacerlo desde tu perfil una vez que ingreses.

          Importante: este chatbot no puede consultar notas ni horarios personales
          desde la plataforma; esa información la ves tú con tu propia cuenta.
        `.trim(),
        categoria: plataforma,
      }),
    );

    const respuestaDecanatos = await respuestaRepository.save(
      respuestaRepository.create({
        respuesta: `
          Decanatos: responsables y contactos

          Decanato de Ingeniería:
          Responsable: Ing. Tania Coro (Decana).
          Celular: 77348103
          Ubicación: Primer piso, bloques académicos.
          Horario: lunes a viernes de 08:00 a 16:00.

          Decanato de Ciencias Empresariales:
          Responsable: Lic. Zandra Bellido (Decana).
          Celular : 69672494.
          Ubicación: Primer piso, bloques académicos.
          Horario: lunes a viernes de 08:00 a 16:00.

          Decanato de Ciencias Jurídicas:
          Responsable: Lic. Wara Alurralde 
          Celular: 77040632
          Ubicación: Primer piso, bloque académicos 
          Horario: lunes a viernes de 08:00 a 16:00

          Jefe de modalidad Semipresencial 
          Responsable: Lic. Jesús Escalante 
          Celular: 74165912
          Ubicación: Primer piso: bloque académicos 
          Horario: Lunes a viernes de 08:00 a 16:00 

          Decanato de Ciencias de la Salud:
          Responsable: Dr. Ingrid Cuellar (Decano).
          Teléfono: 4-645-2005.
          Ubicación: Bloque de Salud, planta baja, oficina 5.
          Horario: lunes a viernes de 08:00 a 16:00.

          Los decanatos brindan orientación académica general y derivan
          al estudiante al área correspondiente.
        `.trim(),
        categoria: decanatos,
      }),
    );

    const respuestaAulas = await respuestaRepository.save(
      respuestaRepository.create({
        respuesta: `
          Aulas y Ubicaciones

          Bloque A: aulas 1 a 8 (planta baja y primer piso)., computo 1 y computo 2, decanaturas 
          Bloque B: aulas 1 a 8 (segundo piso). Computo 3, laboratorio de física, gabinete de fisioterapia 
          Bloque C: aulas 1 a 8, salón auditorio, baños 
          Edificio Administrativo: marketing, registros, cajas, sistemas, rectorado

          Cada aula tiene su número visible en la puerta; puedes guiarte por los mapas
          ubicados en la entrada de cada bloque.

          Importante: este chatbot NO puede consultar en qué aula tienes clases ni tu
          horario personal; esa información la encuentras en la plataforma universitaria.
        `.trim(),
        categoria: aulas,
      }),
    );

    const respuestaModular = await respuestaRepository.save(
      respuestaRepository.create({
        respuesta: `
          Sistema Modular
          
          Consiste en organizar las materias en módulos consecutivos, 
          cursando una materia por mes, en lugar de llevar 
          varias materias al mismo tiempo durante todo un semestre 
          durante ese mes te concentras principalmente en esa asignatura, 
          realizando sus clases, trabajos, prácticas y evaluaciones, y 
          cuando termina el módulo pasas a la siguiente materia
          
          Para conocer las fechas de inicio, fin y el calendario de un módulo,
          consulta el calendario académico oficial publicado por la universidad
          o solicita información en Secretaría General.

          El chatbot no puede consultar el módulo personal de un estudiante.
        `.trim(),
        categoria: sistemaModular,
      }),
    );

    const respuestaAtencion = await respuestaRepository.save(
      respuestaRepository.create({
        respuesta: `
          Atención general: lunes a viernes de 08:00 a 19:30.
          Caja Central: lunes a viernes de 08:00 a 19:30 .
          Biblioteca: lunes a viernes de 08:00 a 21:00
          Sistemas (plataforma): lunes a viernes de 08:00 a 19:00.

          Para trámites específicos dirígete al área correspondiente dentro de su horario.
        `.trim(),
        categoria: atencion,
      }),
    );

    const respuestaServicios = await respuestaRepository.save(
      respuestaRepository.create({
        respuesta: `
          Servicios de la Universidad

          Oportunidades de prácticas profesionales mediante convenios
          Cafetería 3er piso 
          Biblioteca virtual y Biblioteca Central:Ubicación: Bloque C, segundo piso.
          Correo institucional: se asigna a cada estudiante al momento de la inscripción.
          Descuentos en negocios afiliados presentando tu carnet universitario
          Wi-Fi universitario: red "UniversidadUPDS" disponible en todos los bloques.
        `.trim(),
        categoria: servicios,
      }),
    );

    const respuestaInformacionPersonal = await respuestaRepository.save(
      respuestaRepository.create({
        respuesta: `
          Información personal de estudiantes

          Este chatbot NO tiene acceso a datos personales, por lo que no puede decirte
          en qué aula tienes clases, qué materias tienes, tu horario, tus notas
          ni tus calificaciones.

          Para esa información:
          Ingresa a la plataforma universitaria con tu usuario y contraseña.
          mediante este link: https://portal.upds.edu.bo/ 
        `.trim(),
        categoria: informacionPersonal,
      }),
    );

    const respuestaCarreras = await respuestaRepository.save(
      respuestaRepository.create({
        respuesta: `
          Facultades y carreras

          Facultad de Ciencias Jurídicas: Derecho.
          Facultad de Ciencias Empresariales: Administración de Empresas, Contaduría Pública,
          Ingeniería Comercial y Marketing y Publicidad.
          Facultad de Ingeniería: Ingeniería de Sistemas, Ingeniería Industrial, Ingeniería en Redes y Telecomunicaciones, 
          Ingeniería en Gestión Petrolera.
          Facultad de Ciencias Sociales: Psiclogía.
          Facultad de Ciencias de la Salud: Medicina, Fisioterapea y kinesiología.

          Carreras Semiprecenciales: Derecho semipresencial, Administración de Empresas semipresencial, 
          Ingeneria Comercial semipresencial, Ciencias de la Comunicacion Social semipresencial,
          Psicologia semipresencial.
        `.trim(),
        categoria: carreras,
      }),
    );
    
    /*
    PALABRAS CLAVE
    */
    async function crearPalabrasClave(
      palabras: string[],
      respuesta: Respuesta,
    ) {
      for (const palabra of palabras) {
        await palabraClaveRepository.save(
          palabraClaveRepository.create({
            palabras: palabra,
            respuesta,
          }),
        );
      }
    }

    /*
    Marqueting
    */

    await crearPalabrasClave(
      [
        'marketing',
        'mercadotecnia',
        'publicidad',
        'comunicación',
        'comunicacion',
        'difusión',
        'difusion',
        'actividades',
        'campañas',
        'campanas',
        'contacto marketing',
        'telefono marketing',
        'teléfono marketing',
        'número marketing',
        'numero marketing',
        'correo marketing',
      ],
      respuestaMarketing,
    );

    /*
    Cajas y pagos
    */

    await crearPalabrasClave(
      [
        'pago',
        'pagos',
        'pagar',
        'mensualidad',
        'mensualidades',
        'cuota',
        'cuotas',
        'arancel',
        'aranceles',
        'matrícula',
        'matricula',
        'vencimiento',
        'vencimientos',
        'fecha limite',
        'fecha límite',
        'caja',
        'cajas',
        'caja central',
        'cajero',
        'telefono caja',
        'teléfono caja',
        'número caja',
        'numero caja',
        'horario caja',
        'donde pago',
        'dónde pago',
        'como pago',
        'cómo pago',
        'procedimiento de pago',
        'comprobante',
        'recibo',
        'recibo de pago',
        'mora',
        'recargos',
        'medio de pago',
        'medios de pago',
        'transferencia',
        'efectivo',
        'débito',
        'debito',
      ],
      respuestaPagos,
    );

    /*
    Plata forma Universitaria
    */

    await crearPalabrasClave(
      [
        'plataforma',
        'portal',
        'sistema',
        'usuario',
        'login',
        'iniciar sesión',
        'iniciar sesion',
        'contraseña',
        'contrasena',
        'clave',
        'password',
        'recuperar contraseña',
        'recuperar contrasena',
        'olvidé mi contraseña',
        'olvide mi contrasena',
        'olvidé mi contrasena',
        'problemas plataforma',
        'no puedo entrar',
        'no puedo ingresar',
        'acceso plataforma',
        'mesa de ayuda',
        'cambiar contraseña',
        'cambiar contrasena',
      ],
      respuestaPlataforma,
    );

    /*
    Decanos
    */

    await crearPalabrasClave(
      [
        'decanato',
        'decanatos',
        'decano',
        'decana',
        'decanos',
        'decanas',
        'decanato de ingeniería',
        'decanato de ingenieria',
        'decano de ingeniería',
        'decano de ingenieria',
        'ingeniería',
        'ingenieria',
        'decanato de ciencias económicas',
        'decanato de ciencias economicas',
        'ciencias económicas',
        'ciencias economicas',
        'decanato de ciencias sociales',
        'ciencias sociales',
        'decanato de derecho',
        'derecho',
        'decanato de salud',
        'ciencias de la salud',
        'salud',
        'telefono decanato',
        'teléfono decanato',
        'número decanato',
        'numero decanato',
        'número de decanos',
        'numero de decanos',
        'telefono de decanos',
        'teléfono de decanos',
        'contacto decanato',
        'contacto decanos',
        'responsable decanato',
        'nombres de decanos',
        'nombre del decano',
        'quien es el decano',
        'quién es el decano',
        'carlos mamani',
        'ana gutierrez',
        'roberto vargas',
        'lucia choque',
        'jorge pinto',
      ],
      respuestaDecanatos,
    );

    /*
    Aulas Y bloques
    */

    await crearPalabrasClave(
      [
        'aula',
        'aulas',
        'salón',
        'salon',
        'ubicación aula',
        'ubicacion aula',
        'ubicación de aulas',
        'ubicacion de aulas',
        'donde esta el aula',
        'dónde está el aula',
        'numero de aula',
        'número de aula',
        'bloque',
        'bloque a',
        'bloque b',
        'bloque c',
        'edificio',
        'edificio administrativo',
        'laboratorio',
        'laboratorios',
        'mapa',
        'mapas',
      ],
      respuestaAulas,
    );

    /*
    Sistema modular
    */

    await crearPalabrasClave(
      [
        'modular',
        'sistema modular',
        'módulo',
        'modulo',
        'módulos',
        'modulos',
        'periodo académico',
        'periodo academico',
        'calendario modular',
        'calendario académico',
        'calendario academico',
      ],
      respuestaModular,
    );

    /*
    horarios de atencion
    */

    await crearPalabrasClave(
      [
        'atención',
        'atencion',
        'horario',
        'horarios',
        'horario de atención',
        'horario de atencion',
        'cuando atienden',
        'cuándo atienden',
        'oficinas',
        'horario de oficinas',
        'horario de la biblioteca',
        'horario biblioteca',
        'horario de la caja',
        'horario caja',
      ],
      respuestaAtencion,
    );

    /*
    Servicios de la Universidad
    */

    await crearPalabrasClave(
      [
        'servicios',
        'servicios de la universidad',
        'biblioteca',
        'libros',
        'salas de estudio',
        'laboratorio de cómputo',
        'laboratorio de computo',
        'bienestar estudiantil',
        'canchas',
        'gimnasio',
        'cafetería',
        'cafeteria',
        'correo institucional',
        'correo universitario',
        'wifi',
        'internet',
        'seguro universitario',
      ],
      respuestaServicios,
    );


    /*
    Carreras y facultades
    */

    await crearPalabrasClave(
      [
        'mi aula',
        'en que aula',
        'en qué aula',
        'mis materias',
        'qué materias',
        'que materias',
        'mi horario',
        'horario personal',
        'mis notas',
        'mis calificaciones',
        'calificaciones',
        'datos personales',
        'información personal',
        'informacion personal',
        'mis cursos',
        'mis clases',
      ],
      respuestaInformacionPersonal,
    );

    await crearPalabrasClave(
      [
        'carreras',
        'carrera',
        'carreras de la upds',
        'carreras upds',
        'carreras que ofrece',
        'carreras disponibles',
        'qué carreras ofrecen',
        'que carreras ofrecen',
        'qué carreras tiene',
        'que carreras tiene',
        'qué puedo estudiar',
        'que puedo estudiar',
        'oferta académica',
        'oferta academica',
        'facultades',
        'facultad',
        'ingenierías',
        'ingenierias',
        'ingeniería de sistemas',
        'ingenieria de sistemas',
        'ingeniería industrial',
        'ingenieria industrial',
        'ingeniería comercial',
        'ingenieria comercial',
        'derecho',
        'medicina',
        'psicología',
        'psicologia',
        'contaduría pública',
        'contaduria publica',
        'administración de empresas',
        'administracion de empresas',
        'marketing y publicidad',
        'fisioterapia y kinesiología',
        'fisioterapia y kinesiologia',
        'redes y telecomunicaciones',
        'gestión petrolera',
        'gestion petrolera',
        'gestión ambiental',
        'gestion ambiental',
      ],
      respuestaCarreras,
    );


    console.log('Categorías creadas');
    console.log('Respuestas creadas');
    console.log('Palabras clave creadas');

    await dataSource.destroy();

    console.log('Seed terminado correctamente');
  } catch (error) {
    console.error('Error ejecutando seed:', error);

    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }

    process.exit(1);
  }
}

seed();