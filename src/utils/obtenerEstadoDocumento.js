// Función auxiliar de UX para calcular badges de estado
export const obtenerEstadoDoc = (fechaVenc) => {
  if (!fechaVenc) return { texto: 'Sin Vencimiento', clase: 'bg-secondary' }
  
  const hoy = new Date()
  const vencimiento = new Date(fechaVenc)
  const diffDias = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24))

  if (diffDias < 0) return { texto: 'Vencido', clase: 'bg-danger' }
  if (diffDias <= 30) return { texto: 'Por Vencer', clase: 'bg-warning text-dark' }
  return { texto: 'Válido', clase: 'bg-success' }
}

export const estadoDocumentacion = (registro) => {
  if (!registro || !registro.documentos) return 'Incompleto'

  const todosCompletos = CONFIG_DOCUMENTOS.every(cfg => {
    const doc = registro.documentos.find(d => d.tipoDocumento === cfg.Value)
    return doc && doc.cargado && doc.fEmision && (!cfg.requiereVencimiento || doc.fVencimiento)
  })

  return todosCompletos ? 'Completo' : 'Incompleto'
}