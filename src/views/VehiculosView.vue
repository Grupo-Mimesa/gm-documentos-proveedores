<script setup>
import { reactive, ref } from 'vue'
import { empresaStore } from '@/stores/empresaStore.js'

// Lista de vehículos simulada (se sincronizará con SharePoint mediante Power Automate)
const vehiculos = ref([
  { placa: 'A12BC3D', tipo: 'Chuto', estado: 'Completo' },
  { placa: 'X99YZ88', tipo: 'Remolque', estado: 'Pendiente' }
])

// Formulario reactivo para la gestión del vehículo y sus 7 documentos
const formVehiculo = reactive({
  placa: '',
  tipo: 'Chuto', // Opciones: Chuto, Remolque, Camión Rígido
  documentos: {
    tituloPropiedad: { archivo: null, fechaEmision: '' }, // Sin vencimiento
    carnetCirculacion: { archivo: null, fechaEmision: '' }, // Sin vencimiento
    rcv: { archivo: null, fechaEmision: '', fechaVencimiento: '' },
    permisoSanitario: { archivo: null, fechaEmision: '', fechaVencimiento: '' },
    polizaSeguro: { archivo: null, fechaEmision: '', fechaVencimiento: '' },
    certFumigacion: { archivo: null, fechaEmision: '', fechaVencimiento: '' },
    registroResponsabilidad: { archivo: null, fechaEmision: '', fechaVencimiento: '' }
  }
})

const cargando = ref(false)

// Convertidor genérico de archivos a Base64 para enviar a Power Automate
const procesarArchivoVehiculo = (event, docKey) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('El archivo supera el límite permitido de 5MB')
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    formVehiculo.documentos[docKey].archivo = {
      nombre: file.name,
      base64: e.target.result.split(',')[1] // Remueve el prefijo data:... base64,
    }
  }
  reader.readAsDataURL(file)
}

// Indicadores visuales de estado según fechas de vencimiento
const obtenerBadgeEstado = (fechaVenc) => {
  if (!fechaVenc) return { texto: 'Sin Vencimiento', clase: 'bg-secondary' }

  const hoy = new Date()
  const venc = new Date(fechaVenc)
  const diffDias = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24))

  if (diffDias < 0) return { texto: 'Vencido', clase: 'bg-danger' }
  if (diffDias <= 30) return { texto: 'Por Vencer', clase: 'bg-warning text-dark' }
  return { texto: 'Válido', clase: 'bg-success' }
}

const guardarVehiculo = async () => {
  cargando.value = true
  try {
    // Aquí se conectará Axios hacia el endpoint HTTP de Power Automate
    console.log('Payload Vehículo a enviar:', formVehiculo)

    vehiculos.value.push({
      placa: formVehiculo.placa.toUpperCase(),
      tipo: formVehiculo.tipo,
      estado: 'Completo'
    })

    alert('Vehículo registrado exitosamente')
  } catch (error) {
    console.error('Error al guardar vehículo:', error)
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="container py-4">
    <div v-if="cargando" class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 style-overlay">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 fw-bold">Guardando vehículo en SharePoint...</p>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-2">
      <h2><i class="bi bi-truck me-2"></i>Gestión de Vehículos</h2>
      <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalVehiculo">
        <i class="bi bi-plus-circle me-1"></i> Registrar Vehículo
      </button>
    </div>

    <div v-if="empresaStore.datos.rif" class="navbar-text me-auto mb-2">
      Empresa:
      <strong>{{ empresaStore.datos.razonSocial || 'Sin Nombre' }}</strong> 
      <span class="text-muted"> ({{ empresaStore.datos.rif }})</span>
    </div>

    <div class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Placa</th>
                <th>Tipo de Vehículo</th>
                <th>Estado Documental</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in vehiculos" :key="v.placa">
                <td class="fw-bold">{{ v.placa }}</td>
                <td>{{ v.tipo }}</td>
                <td>
                  <span class="badge" :class="v.estado === 'Completo' ? 'bg-success' : 'bg-warning text-dark'">
                    {{ v.estado }}
                  </span>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-secondary me-1" title="Editar">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" title="Eliminar">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalVehiculo" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title"><i class="bi bi-card-heading me-2"></i>Ficha y Documentación de Vehículo</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <form @submit.prevent="guardarVehiculo">
            <div class="modal-body">
              <div class="row g-3 mb-4 bg-light p-3 rounded border">
                <div class="col-md-6">
                  <label class="form-label fw-bold">Placa del Vehículo (Identificador Principal)</label>
                  <input v-model="formVehiculo.placa" type="text" class="form-control text-uppercase" placeholder="Ej: A12BC3D" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Tipo de Unidad</label>
                  <select v-model="formVehiculo.tipo" class="form-select">
                    <option value="Chuto">Chuto / Cabezal</option>
                    <option value="Remolque">Remolque / Batea</option>
                    <option value="Camión Rígido">Camión Rígido</option>
                  </select>
                </div>
              </div>

              <h6 class="fw-bold mb-3 border-bottom pb-2">Matriz de Documentos Obligatorios</h6>
              
              <div class="row g-3">
                <div class="col-md-4">
                  <div class="p-3 border rounded bg-light h-100">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <label class="form-label small fw-bold mb-0">Título de Propiedad</label>
                      <span class="badge bg-secondary style-badge">Sin Venc.</span>
                    </div>
                    <input type="file" class="form-control form-control-sm mb-2" accept=".pdf,.jpg,.png" @change="procesarArchivoVehiculo($event, 'tituloPropiedad')" required />
                    <label class="form-label text-muted style-sublabel mb-1">F. Emisión</label>
                    <input type="date" class="form-control form-control-sm" v-model="formVehiculo.documentos.tituloPropiedad.fechaEmision" required />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="p-3 border rounded bg-light h-100">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <label class="form-label small fw-bold mb-0">Carnet de Circulación</label>
                      <span class="badge bg-secondary style-badge">Sin Venc.</span>
                    </div>
                    <input type="file" class="form-control form-control-sm mb-2" accept=".pdf,.jpg,.png" @change="procesarArchivoVehiculo($event, 'carnetCirculacion')" required />
                    <label class="form-label text-muted style-sublabel mb-1">F. Emisión</label>
                    <input type="date" class="form-control form-control-sm" v-model="formVehiculo.documentos.carnetCirculacion.fechaEmision" required />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="p-3 border rounded bg-light h-100">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <label class="form-label small fw-bold mb-0">Responsabilidad Civil (RCV)</label>
                      <span class="badge" :class="obtenerBadgeEstado(formVehiculo.documentos.rcv.fechaVencimiento).clase">
                        {{ obtenerBadgeEstado(formVehiculo.documentos.rcv.fechaVencimiento).texto }}
                      </span>
                    </div>
                    <input type="file" class="form-control form-control-sm mb-2" accept=".pdf,.jpg,.png" @change="procesarArchivoVehiculo($event, 'rcv')" required />
                    <div class="row g-1">
                      <div class="col-6">
                        <label class="form-label text-muted style-sublabel mb-1">F. Emisión</label>
                        <input type="date" class="form-control form-control-sm" v-model="formVehiculo.documentos.rcv.fechaEmision" required />
                      </div>
                      <div class="col-6">
                        <label class="form-label text-muted style-sublabel mb-1">F. Vencimiento</label>
                        <input type="date" class="form-control form-control-sm" v-model="formVehiculo.documentos.rcv.fechaVencimiento" required />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="p-3 border rounded bg-light h-100">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <label class="form-label small fw-bold mb-0">Permiso Sanitario</label>
                      <span class="badge" :class="obtenerBadgeEstado(formVehiculo.documentos.permisoSanitario.fechaVencimiento).clase">
                        {{ obtenerBadgeEstado(formVehiculo.documentos.permisoSanitario.fechaVencimiento).texto }}
                      </span>
                    </div>
                    <input type="file" class="form-control form-control-sm mb-2" accept=".pdf,.jpg,.png" @change="procesarArchivoVehiculo($event, 'permisoSanitario')" required />
                    <div class="row g-1">
                      <div class="col-6">
                        <label class="form-label text-muted style-sublabel mb-1">F. Emisión</label>
                        <input type="date" class="form-control form-control-sm" v-model="formVehiculo.documentos.permisoSanitario.fechaEmision" required />
                      </div>
                      <div class="col-6">
                        <label class="form-label text-muted style-sublabel mb-1">F. Vencimiento</label>
                        <input type="date" class="form-control form-control-sm" v-model="formVehiculo.documentos.permisoSanitario.fechaVencimiento" required />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="p-3 border rounded bg-light h-100">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <label class="form-label small fw-bold mb-0">Póliza de Seguro</label>
                      <span class="badge" :class="obtenerBadgeEstado(formVehiculo.documentos.polizaSeguro.fechaVencimiento).clase">
                        {{ obtenerBadgeEstado(formVehiculo.documentos.polizaSeguro.fechaVencimiento).texto }}
                      </span>
                    </div>
                    <input type="file" class="form-control form-control-sm mb-2" accept=".pdf,.jpg,.png" @change="procesarArchivoVehiculo($event, 'polizaSeguro')" required />
                    <div class="row g-1">
                      <div class="col-6">
                        <label class="form-label text-muted style-sublabel mb-1">F. Emisión</label>
                        <input type="date" class="form-control form-control-sm" v-model="formVehiculo.documentos.polizaSeguro.fechaEmision" required />
                      </div>
                      <div class="col-6">
                        <label class="form-label text-muted style-sublabel mb-1">F. Vencimiento</label>
                        <input type="date" class="form-control form-control-sm" v-model="formVehiculo.documentos.polizaSeguro.fechaVencimiento" required />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="p-3 border rounded bg-light h-100">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <label class="form-label small fw-bold mb-0">Certificado de Fumigación</label>
                      <span class="badge" :class="obtenerBadgeEstado(formVehiculo.documentos.certFumigacion.fechaVencimiento).clase">
                        {{ obtenerBadgeEstado(formVehiculo.documentos.certFumigacion.fechaVencimiento).texto }}
                      </span>
                    </div>
                    <input type="file" class="form-control form-control-sm mb-2" accept=".pdf,.jpg,.png" @change="procesarArchivoVehiculo($event, 'certFumigacion')" required />
                    <div class="row g-1">
                      <div class="col-6">
                        <label class="form-label text-muted style-sublabel mb-1">F. Emisión</label>
                        <input type="date" class="form-control form-control-sm" v-model="formVehiculo.documentos.certFumigacion.fechaEmision" required />
                      </div>
                      <div class="col-6">
                        <label class="form-label text-muted style-sublabel mb-1">F. Vencimiento</label>
                        <input type="date" class="form-control form-control-sm" v-model="formVehiculo.documentos.certFumigacion.fechaVencimiento" required />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="p-3 border rounded bg-light h-100">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <label class="form-label small fw-bold mb-0">Reg. Responsabilidad Vehicular</label>
                      <span class="badge" :class="obtenerBadgeEstado(formVehiculo.documentos.registroResponsabilidad.fechaVencimiento).clase">
                        {{ obtenerBadgeEstado(formVehiculo.documentos.registroResponsabilidad.fechaVencimiento).texto }}
                      </span>
                    </div>
                    <input type="file" class="form-control form-control-sm mb-2" accept=".pdf,.jpg,.png" @change="procesarArchivoVehiculo($event, 'registroResponsabilidad')" required />
                    <div class="row g-1">
                      <div class="col-6">
                        <label class="form-label text-muted style-sublabel mb-1">F. Emisión</label>
                        <input type="date" class="form-control form-control-sm" v-model="formVehiculo.documentos.registroResponsabilidad.fechaEmision" required />
                      </div>
                      <div class="col-6">
                        <label class="form-label text-muted style-sublabel mb-1">F. Vencimiento</label>
                        <input type="date" class="form-control form-control-sm" v-model="formVehiculo.documentos.registroResponsabilidad.fechaVencimiento" required />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">
                <i class="bi bi-save me-1"></i> Guardar Vehículo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.style-overlay {
  z-index: 9999;
}
.style-badge {
  font-size: 0.65rem;
}
.style-sublabel {
  font-size: 0.75rem;
}
</style>