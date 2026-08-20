<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { empresaStore } from '@/stores/empresaStore.js'
import { obtenerProveedor, guardarProveedor } from '@/services/apiService';
import { obtenerEstadoDoc } from '@/utils/obtenerEstadoDocumento.js';
import { aBooleano } from '@/utils/formatters'
import { TIPO_SERVICIOS, TIPO_DOCUMENTOS_EMPRESA } from '@/constants';

const guardando = ref(false);
const validando = ref(false);
const errorMensaje = ref('');

const empresa = ref({
  rif: '',
  razonSocial: '',
  ab: '',
  servicio: '',
  documentos: {},
  documentos2: []
})

const CONFIG_DOCUMENTOS = computed(() => {
  return TIPO_DOCUMENTOS_EMPRESA.filter(doc => {
    return doc.service.includes(empresa.value.servicio)
  })
})

const actualizarDocumentos = () => {
  empresa.value.documentos2 = CONFIG_DOCUMENTOS.value.map(cfg => {
    const docExistente = empresa.value.documentos2?.find(d => d.tipoDocumento === cfg.Value)
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
}

const cargarDatosProveedor = async () => {
  if (!empresa.value.rif) return;

  empresaStore.limpiarEmpresa();

  empresa.value.razonSocial = '';
  empresa.value.servicio = '';

  validando.value = true;
  errorMensaje.value = '';

  try {
    const data = await obtenerProveedor(empresa.value.rif, empresa.value.ab);
    
    empresa.value = { ...empresa.value, ...data };
    
    actualizarDocumentos();
    empresaStore.setEmpresa(empresa.value);
  } catch (error) {
    errorMensaje.value = 'No se pudo obtener la información de la empresa.';
    console.error(error);
  } finally {
    validando.value = false;
    if (empresa.value.razonSocial) {
      alert('Datos de la empresa cargados exitosamente');
    } else {
      alert('No se encontraron datos para el RIF proporcionado.');
    }
  }
};

const obtenerEtiquetaDoc = (tipo) => CONFIG_DOCUMENTOS.value.find(c => c.Value === tipo)?.label || tipo
const obtenerNotaDoc = (tipo) => CONFIG_DOCUMENTOS.value.find(c => c.Value === tipo)?.note || ''
const requiereVencimiento = (tipo) => CONFIG_DOCUMENTOS.value.find(c => c.Value === tipo)?.requiereVencimiento ?? true

const estructurarDocumentosVacios = () => {
  return CONFIG_DOCUMENTOS.value.map(cfg => ({
    id: null,
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

const actuazlizarArchivo = (index) => {
  empresa.value.documentos2[index].actualizar = true;
  empresa.value.documentos2[index].cargado = false;
  empresa.value.documentos2[index].archivo = null;
  empresa.value.documentos2[index].fEmision = '';
  empresa.value.documentos2[index].fVencimiento = '';
}

const procesarArchivo = (event, docKey) => {
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
    empresa.value.documentos2[docKey].archivo = {
      nombre: file.name,
      base64: e.target.result.split(',')[1]
    }
  }
}

const validarFormulario = () => {
  if (!empresa.value.razonSocial || !empresa.value.rif || !empresa.value.ab || !empresa.value.servicio) {
    alert('Por favor complete la información general.')
    return false
  }

  empresa.value.documentos2.forEach((doc) => {
    if (doc.actualizar && doc.archivo && (!doc.fEmision || (!doc.fVencimiento &&  requiereVencimiento(doc.tipoDocumento)))) {
      alert(`Por favor complete las fechas para el documento: ${obtenerEtiquetaDoc(doc.tipoDocumento)}`)
      return false
    }
  })

  return true
}

/**
 * Adapta el payload para el backend sin alterar el objeto reactivo original.
 * @param {Object} formulario - Estado reactivo original de la vista.
 * @returns {Object} Copia del objeto formateada con los documentos como Array.
 */
function prepararPayload(formulario) {
  const { documentos, ...datosGenerales } = formulario;

  const documentosArray = Object.values(documentos || {});

  return {
    ...datosGenerales,
    documentos: documentosArray
  };
}

const guardarEmpresa = async () => {
  if (!validarFormulario()) return;

  guardando.value = true
  try {
    //const payloadParaEnviar = prepararPayload(empresa.value);
    empresa.value.documentos2 = empresa.value.documentos2.filter(doc => doc.cargado || doc.archivo.base64)
    const respuesta = await guardarProveedor(empresa.value);
    alert('Datos de la empresa guardados exitosamente')
    
    cargarDatosProveedor()
  } catch (error) {
    console.error(error)
    alert('Ocurrió un error al guardar los datos de la empresa')
  } finally {
    guardando.value = false
  }
}

onMounted(() => {
  if (empresaStore.datos) {
    empresa.value = { ...empresa.value, ...empresaStore.datos }
  }
})

watch(() => empresa.value.servicio, () => {
  actualizarDocumentos()
})
</script>

<template>
  <div class="container py-4">
    <div v-if="guardando" class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 style-overlay">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 fw-bold">Guardando datos...</p>
      </div>
    </div>

    <div v-if="validando" class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 style-overlay">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 fw-bold">Validando datos...</p>
      </div>
    </div>

    <form @submit.prevent="guardarEmpresa">
      <div class="card mb-4 shadow-sm">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0"><i class="bi bi-building me-2"></i>Información General</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-5 mb-3">
              <label class="form-label fw-bold">RIF y Número de Proveedor</label>
              <div class="input-group">
                <input 
                  v-model="empresa.rif" 
                  type="text" 
                  class="form-control"
                  name="rif"
                  placeholder="J-12345678-0" 
                  required 
                />
                <input 
                  v-model="empresa.ab" 
                  type="text" 
                  class="form-control"
                  name="ab"
                  placeholder="" 
                  required 
                />
                <button 
                  class="btn btn-outline-primary" 
                  type="button" 
                  @click="cargarDatosProveedor"
                >
                  <i class="bi bi-search me-1"></i> Validar
                </button>
              </div>
            </div>

            <div class="col-md-5">
              <label class="form-label fw-bold">Razón Social</label>
              <input v-model="empresa.razonSocial" type="text" class="form-control-plaintext" placeholder="" readonly required />
            </div>

            <div class="col-md-2">
              <label class="form-label fw-bold">Tipo de Servicio</label>
              <select v-model="empresa.servicio" class="form-select" required :disabled="!empresa.razonSocial">
                <option value="" disabled>Seleccione un tipo</option>
                <option v-for="tipo in TIPO_SERVICIOS" :key="tipo.value" :value="tipo.value">{{ tipo.label }}</option>
              </select>
          </div>

          </div>

          <div v-if="errorMensaje" class="alert alert-danger mt-3" role="alert">
            {{ errorMensaje }}
          </div>
        </div>
      </div>

      <div v-if="empresa.razonSocial" class="card shadow-sm mb-4">
        <div class="card-header bg-dark text-white">
          <h5 class="mb-0"><i class="bi bi-folder-check me-2"></i>Documentos de la Empresa</h5>
        </div>
        <div class="card-body">
          <div class="row g-4">

            <div v-if="empresa.documentos2.length === 0" class="col-12">
              <div class="alert alert-warning mb-0" role="alert">
                Seleccione un tipo de servicio para ver los documentos requeridos.
              </div>
            </div>
            
            <div
              v-for="(doc, index) in empresa.documentos2"
              :key="index"
              class="col-md-4"
            >
              <div class="border rounded p-3 h-100 bg-light">
                <div class="d-flex justify-content-between align-items-start mb-2 gap-2">
                  <div class="d-flex align-items-start gap-2">
                    <h6 class="fw-bold mb-0">{{ obtenerEtiquetaDoc(doc.tipoDocumento) }}</h6>
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
                </div>

                <div v-else class="py-1 mb-2 d-flex justify-content-between align-items-center gap-2">
                  <div class="alert alert-success d-flex align-items-center mb-0 py-1 px-2 gap-1 w-100" role="alert">
                    <i class="bi bi-check-circle-fill"></i>
                    <span class="small">Archivo cargado</span>
                  </div>
                  
                  <button v-if="doc.cargado" 
                    type="button" 
                    class="btn btn-secondary py-1 px-2"
                    @click="actuazlizarArchivo(index)"
                  >
                    <i class="bi bi-pencil me-1"></i>
                  </button>
                </div>

                <label class="form-label text-muted small mb-1">F. Emisión</label>
                <input type="date" class="form-control form-control-sm mb-2" v-model="doc.fEmision" :readonly="doc.cargado" />
                <label class="form-label text-muted small mb-1">F. Vencimiento</label>
                <input v-if="requiereVencimiento(doc.tipoDocumento)" type="date" class="form-control form-control-sm" v-model="doc.fVencimiento" :readonly="doc.cargado" />
                <input v-else type="text" class="form-control form-control-sm" value="No Aplica" disabled />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div v-if="empresa.razonSocial" class="d-flex justify-content-end">
        <button type="submit" class="btn btn-success px-4">
          <i class="bi bi-save me-1"></i> Guardar Cambios
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.style-overlay {
  z-index: 9999;
}
</style>