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
  { type: 'all', service: ['Fijos', 'Eventuales', 'Ambientales', 'Transporte', 'Emergencia'], label: 'RIF', Value: 'RIF', requiereVencimiento: true },
  { type: 'all', service: ['Fijos', 'Eventuales', 'Transporte'], label: 'Registro Mercantil', Value: 'REGISTRO MERCANTIL', requiereVencimiento: false },
  { type: 'all', service: ['Fijos', 'Eventuales', 'Transporte'], label: 'Cédula del Representante Legal', Value: 'C.I REPRESENTANTE LEGAL', requiereVencimiento: true },
  
]

export const TIPO_DOCUMENTOS_EMPLEADOS = [
  { key: 'cedulaDoc', type: 'Todos', service: ['Fijos', 'Eventuales', 'Ambientales', 'Transporte', 'Emergencia'], label: 'Cédula de Identidad', Value: 'Cedula de identidad', requiereVencimiento: true },
  { key: 'ivss', type: 'Contratista', service: ['Fijos', 'Eventuales'], label: 'Constancia de Registro de Trabajador ante el Seguro Social (IVSS)14-02', Value: 'Constancia de registro de trabajador ante el seguro social', note: '', requiereVencimiento: true },
  { key: 'examenMedico', type: 'Contratista', service: ['Fijos', 'Eventuales'], label: 'Constancia de Examen Pre-Empleo (no mayor a un año de emisión)', Value: 'Constancia de examen pre-empleo', note: 'En tal caso pudiese ser entregado un examen Periódico, Pre-Vacacional o Post-Vacacional, de igual manera no mayor a un año', requiereVencimiento: false },
  { key: 'certSalud', type: 'Todos', service: ['Fijos', 'Eventuales', 'Transporte'], label: 'Certificado Médico Sanitario', Value: 'Certificado de salud', requiereVencimiento: true },
  { key: 'manipAlimentos', type: 'Todos', service: ['Fijos', 'Eventuales', 'Transporte'], label: 'Curso de Manipulación de Alimentos', Value: 'Certificado de manipulacion de alimentos', note: 'Certificado avalado por el SACS, Según Providencia Administrativa 070-2015 del 15 de julio de 2015', requiereVencimiento: false },
  { key: 'curriculum', type: 'Contratista', service: ['Fijos', 'Eventuales'], label: 'Currículum del trabajador con soportes', Value: 'Curriculum', note: 'Diplomas de cursos, adiestramientos y certificaciones', requiereVencimiento: false },
  { key: 'desCargo', type: 'Contratista', service: ['Fijos', 'Eventuales'], label: 'Descripción de Cargo', Value: 'Descripción de Cargo', note: 'Debe contener y especificar su alcance de acuerdo con sus funciones, firmado por el trabajador', requiereVencimiento: false },
  { key: 'epp', type: 'Contratista', service: ['Fijos', 'Eventuales', 'Emergencia'], label: 'Constancia de Entrega de Equipo de Protección Personal (EPP)', Value: 'Constancia de entrega de equipo de protección personal', note: 'Debe contener  uso y mantenimiento del o los equipos entregados, firmado y con huella dactilar del trabajador', requiereVencimiento: false },
  { key: 'notiPPCP', type: 'Contratista', service: ['Fijos', 'Eventuales', 'Emergencia'], label: 'Notificación de los Principios de Prevención de las Condiciones Peligrosas, Inseguras e Insalubres', Value: 'Notificación de los Principios de Prevención de las Condiciones Peligrosas, Inseguras e Insalubres', note: 'Según lo establecido en la LOPCYMAT en su art. 56 numeral 3 y en la Norma Técnica del Servicios de Seguridad y Salud en el Trabajo art. 34 numeral 3. (Firmada y con huella dactilar del trabajador y avalada por su supervisor)', requiereVencimiento: false },
  { key: 'analisisRiesgo', type: 'Contratista', service: ['Fijos', 'Eventuales'], label: 'Análisis de Riesgo por Puesto de Trabajo', Value: 'Análisis de riesgo por puesto de trabajo', note: 'Firmado y con huella dactilar del trabajador y CSSL', requiereVencimiento: false },
  { key: 'fichaMedica', type: 'Contratista', service: ['Fijos', 'Eventuales'], label: 'Ficha Médica', Value: 'Ficha Médica', note: 'Son proporcionadas en digital por el Dpto. De Seguridad', requiereVencimiento: false },
  { key: 'notiCLEE', type: 'Contratista', service: ['Fijos', 'Eventuales', 'Emergencia'], label: 'Notificación de Medidas de Prevención de las Condiciones Inseguras e Insalubres por Contacto con Líneas Eléctricas Energizadas', Value: 'Notificación de Medidas de Prevención de las Condiciones Inseguras e Insalubres por Contacto con Líneas Eléctricas Energizadas', note: 'Este formato será proporcionado por el Dpto. De Seguridad de Planta', requiereVencimiento: false },
  { key: 'licencia', type: 'Transporte', service: ['Transporte'], label: 'Licencia de Conducir', Value: 'Licencia de conducir', requiereVencimiento: true },
  { key: 'certVial', type: 'Transporte', service: ['Transporte'], label: 'Certificado Médico Víal', Value: 'Certificado médico', requiereVencimiento: true },
  { key: 'procEmergencia', type: 'Contratista', service: ['Emergencia'], label: 'Procedimientos de Emergencia', Value: 'Procedimientos de Emergencia', note: 'En caso de: Accidente de trabajo/Enfermedad común', requiereVencimiento: true }
]

export const TIPO_DOCUMENTOS_VEHICULOS = [
  { key: 'seguroVehiculo', type: 'Transporte', service: ['Transporte'], label: 'Seguro del Vehículo', Value: 'Seguro del vehículo', requiereVencimiento: true },
  { key: 'respCivil', type: 'Transporte', service: ['Transporte'], label: 'Responsabilidad Civil del Vehículo', Value: 'RCV', requiereVencimiento: true },
  { key: 'planMantenimiento', type: 'Transporte', service: ['Transporte'], label: 'Plan de Mantenimiento del Vehículo', Value: 'Plan de mantenimiento del vehículo', requiereVencimiento: true }
]
