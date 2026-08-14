export const handler = async (event) => {
  // 1. Validar que la petición sea de tipo POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido. Utiliza POST.' })
    }
  }

  try {
    // 2. Extraer los datos enviados desde el frontend
    const bodyData = JSON.parse(event.body || '{}')
    const { payload } = bodyData

    // Validaciones básicas de los datos obligatorios
    if (!payload || !payload.cedula || !payload.nombre) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'La Cédula y el Nombre Completo son obligatorios.' })
      }
    }

    // 3. Obtener la URL privada del Webhook desde las variables de entorno
    const webhookUrl = process.env.PA_POST_EMPLEADOS_API

    if (!webhookUrl) {
      throw new Error('La variable PA_POST_EMPLEADOS_API no está configurada.')
    }

    // 4. Reenviar la información a Power Automate
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error en el Webhook de Power Automate (${response.status}): ${errorText}`)
    }

    const resData = await response.json().catch(() => ({}))

    // 5. Responder al frontend con éxito
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        mensaje: 'Empleado y documentos procesados correctamente.',
        data: resData
      })
    }
  } catch (error) {
    console.error('Error en guardar-empleado:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Error interno al guardar el empleado.',
        detalle: error.message
      })
    }
  }
}