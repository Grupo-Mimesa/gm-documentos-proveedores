import { agruparEmpleados } from '../utils/agruparEmpleados.js'

/**
 * Obtiene los datos generales y matriz documental del proveedor según su RIF.
 * @param {string} rif - Identificador principal (Ej: 'J-12345678-0')
 * @returns {Promise<Object>} Objeto con la información del proveedor y estados documentales.
 */
export async function obtenerProveedor(rif, ab) {
  try {
    const response = await fetch(`/.netlify/functions/obtener-proveedor?rif=${encodeURIComponent(rif)}&ab=${encodeURIComponent(ab)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      throw new Error(errorPayload.error || `Error de red (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en apiService (obtenerProveedor):', error);
    throw error;
  }
}

/**
 * Envía la información general y los documentos del proveedor para actualización.
 * @param {Object} datosProveedor - Objeto con la información a guardar (debe incluir rif).
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export async function guardarProveedor(datosProveedor) {
  try {
    const response = await fetch('/.netlify/functions/guardar-proveedor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(datosProveedor)
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      throw new Error(errorPayload.error || `Error en la solicitud (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en apiService (guardarProveedor):', error);
    throw error;
  }
}

/**
 * Obtiene la lista de empleados/conductores de una empresa por su RIF
 * @param {string} rif - Identificador RIF de la empresa
 */
export const obtenerEmpleados = async (rif) => {
  if (!rif) throw new Error('Se requiere un RIF válido para consultar empleados.')

  try {
    const response = await fetch(`/.netlify/functions/obtener-empleados?rif=${encodeURIComponent(rif)}`)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Error en la petición: ${response.status}`)
    }

    const datosPlanos = await response.json()
  
    return agruparEmpleados(datosPlanos)
  } catch (error) {
    console.error('Error en apiService.obtenerEmpleados:', error)
    throw error;
  }
}

/**
 * Guarda o actualiza un empleado/conductor y su matriz de documentos
 * @param {Object} datosEmpleado - Datos del formulario y sus documentos
 */
export const guardarEmpleado = async (datosEmpleado) => {
  const response = await fetch('/.netlify/functions/guardar-empleado', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosEmpleado)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Error al guardar empleado: ${response.status}`)
  }

  return await response.json()
}

/**
 * Elimina un empleado de la base de datos
 * @param {Object} datosEmpleado - Objeto con la información del empleado a eliminar
 */
export const eliminarEmpleado = async (datosEmpleado) => {
  if (!datosEmpleado.proveedorRif) throw new Error('Se requiere un RIF válido para consultar empleados.')

  try {
    const response = await fetch('/.netlify/functions/eliminar-empleado', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cedula: datosEmpleado.cedula,
        proveedorRif: datosEmpleado.proveedorRif
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Error en la petición: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error en apiService.eliminarEmpleado:', error)
    throw error;
  }
}