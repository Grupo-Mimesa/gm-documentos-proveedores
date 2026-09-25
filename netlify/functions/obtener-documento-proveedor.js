export const handler = async (event) => {
  // 1. Permitir únicamente el método GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido. Utiliza GET.' })
    };
  }

  // 2. Extraer el ID desde los parámetros URL (?id=123)
  const id = event.queryStringParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'El parámetro ID es obligatorio.' })
    };
  }

  try {
    // URL del Webhook de Power Automate configurado en tu archivo .env
    const powerAutomateUrl = process.env.PA_GET_EMPRESA_DOCS_API;

    if (!powerAutomateUrl) {
      throw new Error('La URL de Power Automate no está configurada en las variables de entorno.');
    }

    // 3. Consultar a Power Automate con fetch nativo
    const response = await fetch(`${powerAutomateUrl}&id=${id}`);

    if (!response.ok) {
      throw new Error(`Power Automate devolvió un estado ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // 4. Retornar la respuesta exitosa al frontend
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
        'Content-Disposition': response.headers.get('content-disposition') || 'inline'
      },
      body: base64
    };
  } catch (error) {
    console.error('Error al obtener datos del proveedor:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno al consultar la información del proveedor.' })
    };
  }
};