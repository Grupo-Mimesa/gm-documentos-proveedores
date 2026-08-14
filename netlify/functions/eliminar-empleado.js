export const handler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido. Usa DELETE.' })
    }
  }

  try {
    const { cedula, proveedorRif } = JSON.parse(event.body || '{}')

    if (!cedula) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'La cédula es requerida para eliminar.' })
      }
    }

    const webhookUrl = process.env.PA_DELETE_EMPLEADOS_API

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula, proveedorRif })
      })
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: 'Empleado eliminado con éxito' })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al eliminar empleado', detalle: error.message })
    }
  }
}