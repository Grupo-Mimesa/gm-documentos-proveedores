export const handler = async (event) => {
  // 1. Permitir únicamente el método GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido. Utiliza GET.' })
    };
  }

  // 2. Extraer el RIF y AB desde los parámetros URL (?rif=J-12345678-0&ab=12345678)
  const rif = event.queryStringParameters?.rif;
  const ab = event.queryStringParameters?.ab;

  if (!rif || !ab) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Los parámetros RIF y AB son obligatorios.' })
    };
  }

  try {
    // URL del Webhook de Power Automate configurado en tu archivo .env
    const powerAutomateUrl = process.env.PA_GET_EMPRESA_API;

    if (!powerAutomateUrl) {
      throw new Error('La URL de Power Automate no está configurada en las variables de entorno.');
    }

    // 3. Consultar a Power Automate con fetch nativo
    const response = await fetch(`${powerAutomateUrl}&rif=${encodeURIComponent(rif)}&ab=${encodeURIComponent(ab)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Power Automate devolvió un estado ${response.status}`);
    }

    const data = await response.json();

    // 4. Retornar la respuesta exitosa al frontend
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error al obtener datos del proveedor:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno al consultar la información del proveedor.' })
    };
  }
};