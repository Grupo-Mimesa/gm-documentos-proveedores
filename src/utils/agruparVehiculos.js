/**
 * Agrupa una lista plana de documentos por cédula de empleado
 * @param {Array} listaPlana - Arreglo de registros devuelto por SharePoint
 * @returns {Array} Arreglo de vehículos únicos con documentos anidados
 */
export const agruparVehiculos = (listaPlana = []) => {
  const mapaVehiculos = new Map()

  listaPlana.forEach((registro) => {
    const placa = registro.placa

    if (!placa) return // Ignorar si no hay identificador principal

    // 1. Si el vehículo aún no existe en el Map, lo creamos
    if (!mapaVehiculos.has(placa)) {
      mapaVehiculos.set(placa, {
        placa: registro.placa,
        tipoVehiculo: registro.tipoVehiculo || '',
        proveedorRif: registro.proveedorRif || '',
        documentos: []
      })
    }

    // 2. Anidamos los detalles del documento dentro del vehículo correspondiente
    if (registro.tipoDocumento) {
      mapaVehiculos.get(placa).documentos.push({
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
  return Array.from(mapaVehiculos.values())
}