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
    if (!payload || !payload.placa || !payload.tipoVehiculo) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'La Placa y el Tipo de Vehículo son obligatorios.' })
      }
    }

    // 3. Obtener la URL privada del Webhook desde las variables de entorno
    const webhookUrl = process.env.PA_POST_VEHICULOS_API

    if (!webhookUrl) {
      throw new Error('La variable PA_POST_VEHICULOS_API no está configurada.')
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
        mensaje: 'Vehículo y documentos procesados correctamente.',
        data: resData
      })
    }
  } catch (error) {
    console.error('Error en guardar-vehiculo:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Error interno al guardar el vehículo.',
        detalle: error.message
      })
    }
  }
}