/**
 * Agrupa una lista plana de documentos por cédula de empleado
 * @param {Array} listaPlana - Arreglo de registros devuelto por SharePoint
 * @returns {Array} Arreglo de empleados únicos con documentos anidados
 */
export const agruparEmpleados = (listaPlana = []) => {
  const mapaEmpleados = new Map()

  listaPlana.forEach((registro) => {
    const cedula = registro.cedula

    if (!cedula) return // Ignorar si no hay identificador principal

    // 1. Si el empleado aún no existe en el Map, lo creamos
    if (!mapaEmpleados.has(cedula)) {
      mapaEmpleados.set(cedula, {
        cedula: registro.cedula,
        nombre: registro.nombre,
        proveedorRif: registro.proveedorRif || '',
        documentos: []
      })
    }

    // 2. Anidamos los detalles del documento dentro del empleado correspondiente
    if (registro.tipoDocumento) {
      mapaEmpleados.get(cedula).documentos.push({
        id: registro.id || null,
        tipoDocumento: registro.tipoDocumento,
        fEmision: registro.fEmision || '',
        fVencimiento: registro.fVencimiento || null,
        cargado: true,
        actualizar: false,
        mode: registro.mode || 'new',
        // urlArchivo: registro.urlArchivo || ''
      })
    }
  })

  // Convertir el Map a un Array de objetos únicos
  return Array.from(mapaEmpleados.values())
}