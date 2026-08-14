<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import * as bootstrap from 'bootstrap'
import { empresaStore } from '@/stores/empresaStore.js'
import { 
  obtenerEmpleados, 
  guardarEmpleado as apiGuardarEmpleado, 
  eliminarEmpleado as apiEliminarEmpleado
} from '@/services/apiService.js'
import { obtenerEstadoDoc } from '@/utils/obtenerEstadoDocumento.js';
import { TIPO_DOCUMENTOS_EMPLEADOS } from '@/constants'

const CONFIG_DOCUMENTOS = TIPO_DOCUMENTOS_EMPLEADOS.filter(doc => {
  return doc.service.includes(empresaStore.datos?.servicio)
})

const empleados = ref([])
const cargando = ref(false)
const errorCarga = ref(null)
const guardando = ref(false)
const esEdicion = ref(false)
const modalLabel = ref('')
const modalElementRef = ref(null)
let modalInstance = null

const formEmpleado = reactive({
  cedula: '',
  nombre: '',
  proveedorRif: '',
  documentos: []
})

const cargarEmpleados = async () => {
  const proveedorRif = empresaStore.datos?.rif
  
  if (!proveedorRif) {
    empleados.value = []
    return
  }

  cargando.value = true
  errorCarga.value = null

  try {
    const data = await obtenerEmpleados(proveedorRif)
    empleados.value = Array.isArray(data) ? data : (data || [])
  } catch (err) {
    errorCarga.value = 'No se pudo cargar la lista de empleados. Intenta de nuevo.'
    console.error(err)
  } finally {
    cargando.value = false
  }
}

const estadoDocumentacion = (cedula) => {
  const empleado = empleados.value.find(e => e.cedula === cedula)
  if (!empleado || !empleado.documentos) return 'Incompleto'

  const todosCompletos = CONFIG_DOCUMENTOS.every(cfg => {
    const doc = empleado.documentos.find(d => d.tipoDocumento === cfg.Value)
    return doc && doc.cargado && doc.fEmision && (!cfg.requiereVencimiento || doc.fVencimiento)
  })

  return todosCompletos ? 'Completo' : 'Incompleto'
}

const obtenerEtiquetaDoc = (tipo) => CONFIG_DOCUMENTOS.find(c => c.Value === tipo)?.label || tipo
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

const procesarArchivo = (event, index) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('El archivo no debe superar los 5MB')
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    formEmpleado.documentos[index].archivo = {
      nombre: file.name,
      base64: e.target.result.split(',')[1]
    }
  }
}

const abrirModalNuevo = () => {
  esEdicion.value = false
  formEmpleado.cedula = ''
  formEmpleado.nombre = ''
  formEmpleado.proveedorRif = empresaStore.datos?.rif || ''
  formEmpleado.documentos = estructurarDocumentosVacios()
  modalInstance?.show()
}

const cerrarModal = () => {
  modalInstance?.hide()
}

// Lógica de Edición: Poblar el formulario con el empleado seleccionado
const editarEmpleado = (emp) => {
  esEdicion.value = true
  formEmpleado.cedula = emp.cedula
  formEmpleado.nombre = `${emp.nombre || ''}`.trim().toUpperCase()
  formEmpleado.proveedorRif = emp.proveedorRif || empresaStore.datos?.rif
  modalLabel.value = emp.cedula + ' - ' + emp.nombre
  // Fusionar los documentos existentes con la plantilla maestra
  formEmpleado.documentos = CONFIG_DOCUMENTOS.map(cfg => {
    const docExistente = emp.documentos?.find(d => d.tipoDocumento === cfg.Value)

    return {
      id: docExistente?.id || null,
      tipoDocumento: cfg.Value,
      fEmision: docExistente?.fEmision || '',
      fVencimiento: cfg.requiereVencimiento ? (docExistente?.fVencimiento || '') : null,
      cargado: docExistente?.cargado ?? false,
      actualizar: docExistente?.actualizar ?? true,
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
const eliminarEmpleado = async (emp) => {
  const confirmacion = confirm(`¿Estás seguro de que deseas eliminar al empleado ${emp.nombre} (${emp.cedula})? Esta acción no se puede deshacer.`)
  if (!confirmacion) return

  try {
    await apiEliminarEmpleado(emp)

    // Remover localmente
    empleados.value = empleados.value.filter(e => e.cedula !== emp.cedula)
    alert('Empleado eliminado con éxito.')
  } catch (err) {
    console.error(err)
    alert('Ocurrió un error al intentar eliminar el empleado.')
  }
}

const guardarEmpleado = async () => {
  if (!formEmpleado.cedula || !formEmpleado.nombre) {
    alert('Por favor ingrese la cédula y el nombre completo.')
    return
  }
  
  guardando.value = true

  const payload = { ...formEmpleado }
  payload.nombre = payload.nombre.trim().toUpperCase()
  payload.documentos = payload.documentos.filter(doc => doc.cargado || doc.archivo.base64)

  try {
    await apiGuardarEmpleado({payload: payload})

    alert('Empleado guardado correctamente.')
  } catch (err) {
    console.error(err)
    alert('Ocurrió un error al guardar.')
  } finally {
    guardando.value = false
    cerrarModal()
    cargarEmpleados()
  }
}

onMounted(() => {
  if (modalElementRef.value) {
    modalInstance = new bootstrap.Modal(modalElementRef.value)
  }
  cargarEmpleados()
})

watch(() => empresaStore.datos?.rif, () => {
  cargarEmpleados()
})
</script>

<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h2><i class="bi bi-person me-2"></i>Gestión de Empleados</h2>
      <button class="btn btn-success" @click="abrirModalNuevo">
        <i class="bi bi-plus-circle me-1"></i> Registrar Empleado
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
                <th>Cédula</th>
                <th>Nombre Completo</th>
                <th>Estado Documentación</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in empleados" :key="c.cedula">
                <td>{{ c.cedula }}</td>
                <td class="fw-bold">{{ c.nombre }}</td>
                <td>
                  <span class="badge" :class="estadoDocumentacion(c.cedula) === 'Completo' ? 'bg-success' : 'bg-warning text-dark'">
                    {{ estadoDocumentacion(c.cedula) }}
                  </span>
                </td>
                <td class="text-end">
                  <button 
                    class="btn btn-sm btn-outline-secondary me-1"
                    title="Editar Empleado"
                    @click="editarEmpleado(c)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-danger"
                    title="Eliminar Empleado"
                    @click="eliminarEmpleado(c)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalEmpleado" tabindex="-1" ref="modalElementRef" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title fw-bold">
              {{ esEdicion ? 'Editar Empleado: ' + modalLabel : 'Registrar Nuevo Empleado' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <form @submit.prevent="guardarEmpleado">
            <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
              <div class="row g-3 mb-4">
                <div class="col-md-4">
                  <label class="form-label fw-bold">Cédula de Identidad</label>
                  <input v-model="formEmpleado.cedula" type="number" class="form-control" placeholder="12345678" required />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold">Nombre</label>
                  <input v-model="formEmpleado.nombre" type="text" class="form-control" required />
                </div>
              </div>

              <h6 class="fw-bold mb-3 border-bottom pb-2">Documentos Requeridos</h6>
              <div class="row g-3">
                <div 
                  class="col-md-6" 
                  v-for="(doc, index) in formEmpleado.documentos" 
                  :key="doc.tipoDocumento"
                >
                  <div class="card h-100 shadow-sm border">
                    <div class="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
                      <span>{{ obtenerEtiquetaDoc(doc.tipoDocumento) }}</span>
                      <!--<span v-if="!requiereVencimiento(doc.tipoDocumento)" class="badge bg-info text-dark">
                        Sin Vencimiento
                      </span>-->
                      <span class="badge" :class="obtenerEstadoDoc(doc.fVencimiento).clase">
                        {{ obtenerEstadoDoc(doc.fVencimiento).texto }}
                      </span>
                    </div>
                    <div class="card-body">
                      <div v-if="!doc.cargado" class="mb-3">
                        <label class="form-label small text-muted">
                          Archivo (PDF o Imagen)
                          <span v-if="doc.urlArchivo" class="text-success ms-1">✓ Registrado</span>
                        </label>
                        <input 
                          type="file" 
                          class="form-control form-control-sm"
                          accept=".pdf,.png,.jpg,.jpeg"
                          @change="procesarArchivo($event, index)"
                        />
                        <small v-if="doc.archivo.nombre" class="text-muted d-block mt-1">
                          Archivo seleccionado: {{ doc.archivo.nombre }}
                        </small>
                      </div>

                      <div v-else class="alert alert-success py-2 mb-2 d-flex justify-content-between align-items-center">
                        <span class="small">Archivo cargado</span>
                      </div>

                      <div class="row g-2">
                        <div class="col-6">
                          <label class="form-label small">Fecha Emisión</label>
                          <input 
                            type="date" 
                            class="form-control form-control-sm"
                            v-model="doc.fEmision"
                          />
                        </div>
                        <div class="col-6" v-if="requiereVencimiento(doc.tipoDocumento)">
                          <label class="form-label small">Fecha Vencimiento</label>
                          <input 
                            type="date" 
                            class="form-control form-control-sm"
                            v-model="doc.fVencimiento"
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
              <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" :disabled="guardando">
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