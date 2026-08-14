/**
 * Convierte un valor individual (string, número o booleano) a booleano real.
 * @param {any} val - Valor a evaluar
 * @returns {boolean}
 */
export const aBooleano = (val) => {
  if (typeof val === 'boolean') return val
  if (typeof val === 'number') return val === 1

  if (typeof val === 'string') {
    const normalizado = val.trim().toLowerCase()
    return normalizado === 'true'
  }

  return false
}

/**
 * Recorre recursivamente un objeto o array y convierte a booleanos
 * los valores string que coincidan con claves específicas o representaciones booleanas.
 * @param {any} data - Respuesta JSON recibida (objeto, array o valor primitivo)
 * @param {Array<string>} [keysToParse] - (Opcional) Array de nombres de claves específicas a convertir (ej: ['requiereVencimiento', 'activo'])
 * @returns {any} Estructura de datos normalizada
 */
export const normalizarBooleanos = (data, keysToParse = null) => {
  if (data === null || data === undefined) return data

  // Si es un Array, iterar recursivamente cada elemento
  if (Array.isArray(data)) {
    return data.map((item) => normalizarBooleanos(item, keysToParse))
  }

  // Si es un Objeto, normalizar cada clave/valor
  if (typeof data === 'object') {
    const resultado = {}
    for (const [key, value] of Object.entries(data)) {
      const debeConvertir = !keysToParse || keysToParse.includes(key)

      if (debeConvertir && typeof value === 'string' && ['true', 'false', '1', '0'].includes(value.trim().toLowerCase())) {
        resultado[key] = aBooleano(value)
      } else if (typeof value === 'object' && value !== null) {
        resultado[key] = normalizarBooleanos(value, keysToParse)
      } else {
        resultado[key] = value
      }
    }
    return resultado
  }

  // Si es un valor primitivo directo
  return typeof data === 'string' && ['true', 'false', '1', '0'].includes(data.trim().toLowerCase())
    ? aBooleano(data)
    : data
}