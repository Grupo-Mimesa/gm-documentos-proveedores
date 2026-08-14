export const handler = async (event) => {
  // 1. Validar método HTTP
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido. Utiliza GET.' })
    }
  }

  // 2. Obtener el RIF enviado en la URL (?rif=J-12345678-0)
  const rif = event.queryStringParameters?.rif

  if (!rif) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'El parámetro RIF es obligatorio.' })
    }
  }

  try {
    const webhookUrl = process.env.PA_GET_EMPLEADOS_API

    if (!webhookUrl) {
      throw new Error('La variable PA_GET_EMPLEADOS_API no está configurada.')
    }

    // 3. Consultar a Power Automate mediante fetch nativo de Node 18+
    const response = await fetch(`${webhookUrl}&rif=${encodeURIComponent(rif)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })

    if (!response.ok) {
      throw new Error(`Error en Power Automate: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    }
  } catch (error) {
    console.error('Error al obtener empleados:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error al consultar la lista de empleados', 
        detalle: error.message 
      })
    }
  }
}