<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import * as bootstrap from 'bootstrap'
import { empresaStore } from '@/stores/empresaStore.js'
import { 
  obtenerVehiculos, 
  obtenerDocumentoVehiculo,
  guardarVehiculo as apiGuardarVehiculo, 
  eliminarVehiculo as apiEliminarVehiculo
} from '@/services/apiService.js'
import { obtenerEstadoDoc, estadoDocumentacion } from '@/utils/obtenerEstadoDocumento.js'
import { aBooleano } from '@/utils/formatters'
import { TIPO_DOCUMENTOS_VEHICULOS } from '@/constants'

const CONFIG_DOCUMENTOS = TIPO_DOCUMENTOS_VEHICULOS.filter(doc => {
  return doc.service.includes(empresaStore.datos?.servicio)
})

const vehiculos = ref([])
const cargando = ref(false)
const errorCarga = ref(null)
const guardando = ref(false)
const esEdicion = ref(false)
const modalLabel = ref('')
const modalElementRef = ref(null)
let modalInstance = null

const formVehiculo = reactive({
  placa: '',
  proveedorRif: empresaStore.datos.rif,
  tipoVehiculo: '',
  documentos: []
})

const cargarVehiculos = async () => {
  const proveedorRif = empresaStore.datos?.rif
  
  if (!proveedorRif) {
    vehiculos.value = []
    return
  }

  cargando.value = true
  errorCarga.value = null

  try {
    const data = await obtenerVehiculos(proveedorRif)
    vehiculos.value = Array.isArray(data) ? data : (data || [])
  } catch (err) {
    errorCarga.value = 'No se pudo cargar la lista de vehículos. Intenta de nuevo.'
    console.error(err)
  } finally {
    cargando.value = false
  }
}

const obtenerEtiquetaDoc = (tipo) => CONFIG_DOCUMENTOS.find(c => c.Value === tipo)?.label || tipo
const obtenerNotaDoc = (tipo) => CONFIG_DOCUMENTOS.find(c => c.Value === tipo)?.note || ''
const requiereVencimiento = (tipo) => CONFIG_DOCUMENTOS.find(c => c.Value === tipo)?.requiereVencimiento ?? true

// Inicializar un arreglo de documentos vacío con la estructura por defecto
const estructurarDocumentosVacios = () => {
  return CONFIG_DOCUMENTOS.map(cfg => ({
    tipoDocumento: cfg.Value,
    fEmision: '',
    fVencimiento: cfg.requiereVencimiento ? '' : null,
    cargado: false,
    actualizar: true,
    mode: 'new',
    archivo: {
      base64: '',
      nombre: ''
    }
    //urlArchivo: ''
  }))
}

const verArchivo = async (id) => {

  const blob = await obtenerDocumentoVehiculo(id);
  const url = URL.createObjectURL(blob);

  window.open(url, '_blank');
}

const actualizarArchivo = (index) => {
  formVehiculo.documentos[index].actualizar = true;
  formVehiculo.documentos[index].cargado = false;
  formVehiculo.documentos[index].archivo = { nombre: '', base64: '' };
  formVehiculo.documentos[index].fEmision = '';
  formVehiculo.documentos[index].fVencimiento = '';
}

const procesarArchivo = (event, index) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('El archivo supera el límite permitido de 5MB')
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    formVehiculo.documentos[index].archivo = {
      nombre: file.name,
      base64: e.target.result.split(',')[1] // Remueve el prefijo data:... base64,
    }
  }
}

const abrirModalNuevo = () => {
  esEdicion.value = false
  formVehiculo.placa = ''
  formVehiculo.tipoVehiculo = ''
  formVehiculo.proveedorRif = empresaStore.datos?.rif || ''
  formVehiculo.documentos = estructurarDocumentosVacios()
  modalInstance?.show()
}

const cerrarModal = () => {
  modalInstance?.hide()
}

// Lógica de Edición: Poblar el formulario con el empleado seleccionado
const editarVehiculo = (veh) => {
  esEdicion.value = true
  formVehiculo.placa = veh.placa
  formVehiculo.tipoVehiculo = veh.tipoVehiculo
  formVehiculo.proveedorRif = veh.proveedorRif || empresaStore.datos?.rif
  modalLabel.value = veh.placa + ' - ' + veh.tipoVehiculo
  // Fusionar los documentos existentes con la plantilla maestra
  formVehiculo.documentos = CONFIG_DOCUMENTOS.map(cfg => {
    const docExistente = veh.documentos?.find(d => d.tipoDocumento === cfg.Value)

    return {
      id: docExistente?.id || null,
      tipoDocumento: cfg.Value,
      fEmision: docExistente?.fEmision || '',
      fVencimiento: cfg.requiereVencimiento ? (docExistente?.fVencimiento || '') : null,
      cargado: aBooleano(docExistente?.cargado) ?? false,
      actualizar: aBooleano(docExistente?.actualizar) ?? true,
      mode: docExistente?.mode ?? 'new',
      //urlArchivo: docExistente?.urlArchivo || '',
      archivo: {
        base64: '',
        nombre: ''
      }
    }
  })

  modalInstance?.show()
}

// Lógica de Eliminación
const eliminarVehiculo = async (veh) => {
  const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el vehículo ${veh.placa} (${veh.tipoVehiculo})? Esta acción no se puede deshacer.`)
  if (!confirmacion) return

  try {
    await apiEliminarVehiculo(veh)

    vehiculos.value = vehiculos.value.filter(v => v.placa !== veh.placa)

    alert('Vehículo eliminado con éxito.')
  } catch (err) {
    console.error(err)
    alert('Ocurrió un error al intentar eliminar el vehículo.')
  }
}

const validarFormulario = () => {
  if (!formVehiculo.placa || !formVehiculo.tipoVehiculo) {
    alert('Por favor ingrese la placa y el tipo de vehículo.')
    return false
  }

  formVehiculo.documentos.forEach((doc) => {
    if (doc.actualizar && doc.archivo.base64 && (!doc.fEmision || (!doc.fVencimiento &&  requiereVencimiento(doc.tipoDocumento)))) {
      alert(`Por favor complete las fechas para el documento: ${obtenerEtiquetaDoc(doc.tipoDocumento)}`)
      return false
    }
  })

  return true
}

const guardarVehiculo = async () => {
  if (!validarFormulario()) return;

  cargando.value = true

  const payload = { ...formVehiculo }
  payload.placa = payload.placa.trim().toUpperCase()
  payload.documentos = payload.documentos.filter(doc => doc.cargado || doc.archivo.base64)

  try {
    await apiGuardarVehiculo({payload: payload})
    alert('Vehículo registrado exitosamente')
  } catch (error) {
    console.error('Error al guardar vehículo:', error)
    alert('Ocurrió un error al guardar el vehículo. Por favor, inténtelo de nuevo.')
  } finally {
    cargando.value = false
    cerrarModal()
    cargarVehiculos()
  }
}

onMounted(() => {
  if (modalElementRef.value) {
    modalInstance = new bootstrap.Modal(modalElementRef.value)
  }
  cargarVehiculos()
})

watch(() => empresaStore.datos?.rif, () => {
  cargarVehiculos()
})
</script>

<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h2><i class="bi bi-truck me-2"></i>Gestión de Vehículos</h2>
      <button class="btn btn-success" @click="abrirModalNuevo">
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
                <th>Estado Documentación</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in vehiculos" :key="v.placa">
                <td class="fw-bold">{{ v.placa }}</td>
                <td>{{ v.tipoVehiculo }}</td>
                <td>
                  <span class="badge" :class="estadoDocumentacion(v, CONFIG_DOCUMENTOS) === 'Completo' ? 'bg-success' : 'bg-warning text-dark'">
                    {{ estadoDocumentacion(v, CONFIG_DOCUMENTOS) }}
                  </span>
                </td>
                <td class="text-end">
                  <button 
                    class="btn btn-sm btn-outline-secondary me-1"
                    title="Editar Vehículo"
                    @click="editarVehiculo(v)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    v-show="false"
                    class="btn btn-sm btn-outline-danger"
                    title="Eliminar vehículo"
                    @click="eliminarVehiculo(v)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="cargando" class="text-center p-3">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        <div v-if="!cargando && vehiculos.length === 0" class="text-center p-3 text-muted">
          No hay vehículos registrados.
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalVehiculo" tabindex="-1" ref="modalElementRef" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title fw-bold">
              {{ esEdicion ? 'Editar Vehículo: ' + modalLabel : 'Registrar Nuevo Vehículo' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <form @submit.prevent="guardarVehiculo">
            <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
              <div class="row g-3 mb-4">
                <div class="col-md-4">
                  <label class="form-label fw-bold">Placa del Vehículo</label>
                  <input v-model="formVehiculo.placa" type="text" class="form-control text-uppercase" placeholder="Ej: A12BC3D" required />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold">Tipo de Unidad</label>
                  <input v-model="formVehiculo.tipoVehiculo" type="text" class="form-control" placeholder="" required />
                </div>
              </div>

              <h6 class="fw-bold mb-3 border-bottom pb-2">Documentos Requeridos</h6>
              <div class="row g-3">
                <div class="col-md-6"
                  v-for="(doc, index) in formVehiculo.documentos" 
                  :key="doc.tipoDocumento"
                >
                  <div class="card h-100 shadow-sm border">
                    <div class="card-header bg-white fw-bold d-flex justify-content-between align-items-start">
                      <div class="d-flex align-items-start gap-2">
                        <span>{{ obtenerEtiquetaDoc(doc.tipoDocumento) }}</span>
                        <i
                          v-if="obtenerNotaDoc(doc.tipoDocumento)"
                          class="bi bi-info-circle-fill text-primary"
                          role="button"
                          :title="obtenerNotaDoc(doc.tipoDocumento)"
                          style="cursor: pointer; font-size: 0.9rem;"
                        ></i>
                      </div>

                      <span class="badge" :class="obtenerEstadoDoc(doc.fVencimiento).clase">
                        {{ obtenerEstadoDoc(doc.fVencimiento).texto }}
                      </span>
                    </div>
                    <div class="card-body">
                      <div v-if="!doc.cargado" class="mb-2">
                        <label class="form-label small text-muted">
                          Archivo (PDF o Imagen)
                          <!-- <span v-if="doc.urlArchivo" class="text-success ms-1">✓ Registrado</span> -->
                        </label>
                        <input 
                          type="file" 
                          class="form-control form-control-sm"
                          accept=".pdf,.png,.jpg,.jpeg"
                          @change="procesarArchivo($event, index)"
                        />
                        <small v-if="doc.archivo?.nombre" class="text-muted d-block mt-1">
                          Archivo seleccionado: {{ doc.archivo.nombre }}
                        </small>
                      </div>

                      <div v-else class="py-1 mb-2 d-flex justify-content-between align-items-center gap-2">
                        <div class="alert alert-success d-flex align-items-center mb-0 py-1 px-2 gap-1 w-100" role="alert">
                          <i class="bi bi-check-circle-fill"></i>
                          <span class="small">Archivo cargado</span>
                        </div>

                        <button v-if="doc.cargado" 
                          type="button" 
                          class="btn btn-primary py-1 px-2"
                          @click="verArchivo(doc.id)"
                        >
                          <i class="bi bi-eye"></i>
                        </button>
                        
                        <button v-if="doc.cargado" 
                          type="button" 
                          class="btn btn-warning py-1 px-2"
                          @click="actualizarArchivo(index)"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                      </div>

                      <div class="row g-2">
                        <div class="col-6">
                          <label class="form-label small">Fecha Emisión</label>
                          <input 
                            type="date" 
                            class="form-control form-control-sm"
                            v-model="doc.fEmision"
                            :readonly="doc.cargado"
                          />
                        </div>
                        <div class="col-6" v-if="requiereVencimiento(doc.tipoDocumento)">
                          <label class="form-label small">Fecha Vencimiento</label>
                          <input 
                            type="date" 
                            class="form-control form-control-sm"
                            v-model="doc.fVencimiento"
                            :readonly="doc.cargado"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="guardando">
                <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
                {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.style-badge {
  font-size: 0.65rem;
}
</style>