export const TIPO_PROVEEDOR = [
  "Transporte",
  "Contratista"
]

export const TIPO_SERVICIOS = [
  "Fijos",
  "Eventuales",
  "Ambientales",
  "Transporte",
  "Emergencia"
]

export const TIPO_DOCUMENTOS_EMPRESA = [
  { service: ['Fijos', 'Eventuales', 'Ambientales', 'Transporte', 'Emergencia'], label: 'Registro de Información Fiscal (RIF)', Value: 'RIF', requiereVencimiento: true },
  { service: ['Fijos', 'Eventuales', 'Transporte'], label: 'Cédula del Representante Legal', Value: 'C.I REPRESENTANTE LEGAL', requiereVencimiento: true },
  { service: ['Fijos', 'Eventuales', 'Transporte'], label: 'Registro Mercantil', Value: 'REGISTRO MERCANTIL', requiereVencimiento: false },
  { service: ['Fijos', 'Eventuales'], label: 'Inscripción ante el IVSS', Value: 'IVSS', note: 'Forma 1401', requiereVencimiento: false },
  { service: ['Fijos', 'Eventuales'], label: 'Número de Identificación Laboral (NIL)', Value: 'NIL', requiereVencimiento: false },
  { service: ['Fijos', 'Eventuales'], label: 'Certificado electrónico de formalización de Registro de Centro de Trabajo para las Declaraciones en Línea ante INPSASEL', Value: 'INPSASEL', requiereVencimiento: false },
  { service: ['Fijos', 'Eventuales'], label: 'Póliza de Responsabilidad Patronal', Value: 'POLIZA RESPONSABILIDAD PATRONAL', requiereVencimiento: false },
  { service: ['Fijos', 'Eventuales'], label: 'Póliza de responsabilidad empresarial', Value: 'PÓLIZA DE RESPONSABILIDAD EMPRESARIAL', note:'', requiereVencimiento: false },
  { service: ['Fijos', 'Eventuales'], label: 'Póliza de responsabilidad civil', Value: 'PÓLIZA DE RESPONSABILIDAD CIVIL', note:'Sólo aplica a Contratistas que realizan trabajos de alto riesgo en las instalaciones, Medio Ambiente ejm: Obras de construcción, desechos peligrosos', requiereVencimiento: false },
  { service: ['Fijos'], label: 'Certificado de Conformidad ante el Cuerpo de Bombero', Value: 'CERTIFICADO DE CONFORMIDAD ANTE EL CUERPO DE BOMBERO', note:'Correspondiente a la oficina donde esté incluido la dirección fiscal (No limitante)', requiereVencimiento: false },
  { service: ['Fijos', 'Eventuales'], label: 'Registro de Profesional en el área de Seguridad y Salud en el Trabajo ante Inpsasel de la persona encargada de la Seguridad y Salud de la contratista', Value: 'REGISTRO DE PROFESIONAL EN EL ÁREA DE SEGURIDAD Y SALUD EN EL TRABAJO ANTE INPSASEL DE LA PERSONA ENCARGADA DE LA SEGURIDAD Y SALUD DE LA CONTRATISTA', note:'', requiereVencimiento: false },
  { service: ['Fijos'], label: 'Contrato con Servicio de Salud Ocupacional', Value: 'CONTRATO CON SERVICIO DE SALUD OCUPACIONAL', note:'Conformación:  -Registro de profesionales que lo conforman.  -Estructura Organizacional del Servicio.  -Plan de trabajo del Servicio.  -Horarios de Atención.  -Listado De Personas que Conforman el Servicio', requiereVencimiento: false },
  { service: ['Fijos'], label: 'Contrato con Servicio de Ambulancia para traslados en caso de accidentes de trabajo', Value: 'CONTRATO CON SERVICIO DE AMBULANCIA PARA TRASLADOS EN CASO DE ACCIDENTES DE TRABAJO', note:'Sólo aplica a Localidades que no tienen ambulancia o están en zonas muy lejanas', requiereVencimiento: false },
  { service: ['Fijos'], label: 'Propuesta de Programa de Seguridad y Salud en el Trabajo (PSST)', Value: 'PROPUESTA DE PROGRAMA DE SEGURIDAD Y SALUD EN EL TRABAJO (PSST)', note:'Según Norma Técnica NT 04-2023 Firmado y aprobado por el CSSL y Empresa. *Anexo: se debe integrar al programa, lo concerniente a los temas de Bioseguridad derivados del Covid-19', requiereVencimiento: false },
  { service: ['Fijos', 'Eventuales'], label: 'Plan para el Control de Emergencia', Value: 'PLAN PARA EL CONTROL DE EMERGENCIA', note:'Según Norma Covenin 2226-90. *Debe ir anexo al Programa de Seguridad y Salud en el Trabajo Pto. 12).', requiereVencimiento: false },
  { service: ['Fijos', 'Eventuales'], label: 'Procedimientos específicos para la pronta respuesta en caso de presentarse los siguientes escenarios, máximo 4 hojas:', Value: 'PROCEDIMIENTOS ESPECÍFICOS PARA LA PRONTA RESPUESTA EN CASO DE PRESENTARSE LOS SIGUIENTES ESCENARIOS, MÁXIMO 4 HOJAS:', note:'-Accidente de trabajo.  -Enfermedad común.  -Contingencia por Conmoción Nacional', requiereVencimiento: false },
  { service: ['Fijos'], label: 'Registro vigente de Delegados de Prevención ante el INPSASEL para la Localidad', Value: 'REGISTRO VIGENTE DE DELEGADOS DE PREVENCIÓN ANTE EL INPSASEL PARA LA LOCALIDAD', note:'', requiereVencimiento: false },
  { service: ['Fijos'], label: 'Registro del Comité de Seguridad y Salud Laboral ante el INPSASEL para la Localidad', Value: 'REGISTRO DEL COMITÉ DE SEGURIDAD Y SALUD LABORAL ANTE EL INPSASEL PARA LA LOCALIDAD', note:'', requiereVencimiento: false },
  { service: ['Fijos'], label: 'Planilla de Registro de Comité de Seguridad y Salud Laboral', Value: 'PLANILLA DE REGISTRO DE COMITÉ DE SEGURIDAD Y SALUD LABORAL', note:'', requiereVencimiento: false },
  { service: ['Fijos'], label: 'Gestión Mensual de Seguridad y Salud Laboral', Value: 'GESTIÓN MENSUAL DE SEGURIDAD Y SALUD LABORAL', note:'Formato Excel', requiereVencimiento: false },
  { service: ['Fijos'], label: 'Listado del Personal', Value: 'LISTADO DEL PERSONAL', note:'Nómina del personal actualizada donde indique; Nombre y Apellido, Cédula de Identidad, Cargo y Fecha de Nacimiento de cada trabajador) autorizado para ingresar a Grupo Mimesa', requiereVencimiento: false },
  //{ service: ['Fijos'], label: '', Value: '', requiereVencimiento: false },
]

export const TIPO_DOCUMENTOS_EMPLEADOS = [
  { key: 'cartaExoneracion', type: 'Contratista', 
    service: ['Emergencia'], label: 'Carta de Exoneración de Responsabilidad y Compromiso', Value: 'Carta de Exoneración de Responsabilidad y Compromiso', requiereVencimiento: false },
  { key: 'cedulaDoc', type: 'Todos', 
    service: ['Fijos', 'Eventuales', 'Ambientales', 'Transporte', 'Emergencia'], label: 'Cédula de Identidad', Value: 'Cedula de identidad', requiereVencimiento: true },
  { key: 'ivss', type: 'Contratista', 
    service: ['Fijos', 'Eventuales'], label: 'Constancia de Registro de Trabajador ante el Seguro Social (IVSS)14-02', Value: 'Constancia de registro de trabajador ante el seguro social', note: '', requiereVencimiento: true },
  { key: 'examenMedico', type: 'Contratista', 
    service: ['Fijos', 'Eventuales'], label: 'Constancia de Examen Pre-Empleo (no mayor a un año de emisión)', Value: 'Constancia de examen pre-empleo', note: 'En tal caso pudiese ser entregado un examen Periódico, Pre-Vacacional o Post-Vacacional, de igual manera no mayor a un año', requiereVencimiento: false },
  { key: 'certSalud', type: 'Todos', 
    service: ['Fijos', 'Eventuales', 'Transporte'], label: 'Certificado Médico Sanitario', Value: 'Certificado de salud', requiereVencimiento: true },
  { key: 'manipAlimentos', type: 'Todos', 
    service: ['Fijos', 'Eventuales', 'Transporte'], label: 'Curso de Manipulación de Alimentos', Value: 'Certificado de manipulacion de alimentos', note: 'Certificado avalado por el SACS, Según Providencia Administrativa 070-2015 del 15 de julio de 2015', requiereVencimiento: false },
  { key: 'curriculum', type: 'Contratista', 
    service: ['Fijos', 'Eventuales'], label: 'Currículum del trabajador con soportes', Value: 'Curriculum', note: 'Diplomas de cursos, adiestramientos y certificaciones', requiereVencimiento: false },
  { key: 'desCargo', type: 'Contratista', 
    service: ['Fijos', 'Eventuales'], label: 'Descripción de Cargo', Value: 'Descripción de Cargo', note: 'Debe contener y especificar su alcance de acuerdo con sus funciones, firmado por el trabajador', requiereVencimiento: false },
  { key: 'epp', type: 'Contratista', 
    service: ['Fijos', 'Eventuales', 'Emergencia'], label: 'Constancia de Entrega de Equipo de Protección Personal (EPP)', Value: 'Constancia de entrega de equipo de protección personal', note: 'Debe contener  uso y mantenimiento del o los equipos entregados, firmado y con huella dactilar del trabajador', requiereVencimiento: false },
  { key: 'notiPPCP', type: 'Contratista', 
    service: ['Fijos', 'Eventuales', 'Emergencia'], label: 'Notificación de los Principios de Prevención de las Condiciones Peligrosas, Inseguras e Insalubres', Value: 'Notificación de los Principios de Prevención de las Condiciones Peligrosas, Inseguras e Insalubres', note: 'Según lo establecido en la LOPCYMAT en su art. 56 numeral 3 y en la Norma Técnica del Servicios de Seguridad y Salud en el Trabajo art. 34 numeral 3. (Firmada y con huella dactilar del trabajador y avalada por su supervisor)', requiereVencimiento: false },
  { key: 'analisisRiesgo', type: 'Contratista', 
    service: ['Fijos', 'Eventuales'], label: 'Análisis de Riesgo por Puesto de Trabajo', Value: 'Análisis de riesgo por puesto de trabajo', note: 'Firmado y con huella dactilar del trabajador y CSSL', requiereVencimiento: false },
  { key: 'fichaMedica', type: 'Contratista', 
    service: ['Fijos', 'Eventuales'], label: 'Ficha Médica', Value: 'Ficha Médica', note: 'Son proporcionadas en digital por el Dpto. De Seguridad', requiereVencimiento: false },
  { key: 'notiCLEE', type: 'Contratista', 
    service: ['Fijos', 'Eventuales', 'Emergencia'], label: 'Notificación de Medidas de Prevención de las Condiciones Inseguras e Insalubres por Contacto con Líneas Eléctricas Energizadas', Value: 'Notificación de Medidas de Prevención de las Condiciones Inseguras e Insalubres por Contacto con Líneas Eléctricas Energizadas', note: 'Este formato será proporcionado por el Dpto. De Seguridad de Planta', requiereVencimiento: false },
  { key: 'licencia', type: 'Transporte', 
    service: ['Transporte'], label: 'Licencia de Conducir', Value: 'Licencia de conducir', requiereVencimiento: true },
  { key: 'certVial', type: 'Transporte', 
    service: ['Transporte'], label: 'Certificado Médico Víal', Value: 'Certificado médico', requiereVencimiento: true },
  { key: 'procEmergencia', type: 'Contratista', 
    service: ['Emergencia'], label: 'Procedimientos de Emergencia', Value: 'Procedimientos de Emergencia', note: 'En caso de: Accidente de trabajo/Enfermedad común', requiereVencimiento: true }
]

export const TIPO_DOCUMENTOS_VEHICULOS = [
  { key: 'seguroVehiculo', type: 'Transporte', service: ['Transporte'], label: 'Seguro del Vehículo', Value: 'Seguro del vehículo', requiereVencimiento: true },
  { key: 'respCivil', type: 'Transporte', service: ['Transporte'], label: 'Responsabilidad Civil del Vehículo', Value: 'RCV', requiereVencimiento: true },
  { key: 'planMantenimiento', type: 'Transporte', service: ['Transporte'], label: 'Plan de Mantenimiento del Vehículo', Value: 'Plan de mantenimiento del vehículo', requiereVencimiento: true }
]
