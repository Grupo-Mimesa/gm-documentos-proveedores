export const handler = async (event) => {
  // 1. Validar que solo se permitan peticiones POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Método no permitido. Utiliza POST.' })
    };
  }

  // 2. Parsear y validar el cuerpo de la petición (payload)
  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (parseError) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'El cuerpo de la petición debe ser un JSON válido.' })
    };
  }

  // Validación básica de campos requeridos
  if (!payload.rif) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'El campo "rif" es obligatorio para actualizar el proveedor.' })
    };
  }

  try {
    // 3. Obtener la URL del Webhook de Power Automate desde las variables de entorno
    const powerAutomateUrl = process.env.PA_POST_EMPRESA_API;

    if (!powerAutomateUrl) {
      throw new Error('La URL del Webhook para guardar empresa no está configurada en .env');
    }

    // 4. Reenviar los datos a Power Automate mediante fetch nativo
    const response = await fetch(powerAutomateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const textError = await response.text().catch(() => '');
      throw new Error(`Power Automate devolvió status ${response.status}: ${textError}`);
    }

    const responseData = await response.json().catch(() => ({ mensaje: 'Registro actualizado correctamente' }));

    // 5. Retornar respuesta exitosa al cliente
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exito: true,
        data: responseData
      })
    };

  } catch (error) {
    console.error('Error en guardar-proveedor:', error.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Error interno del servidor al procesar la actualización del proveedor.'
      })
    };
  }
};