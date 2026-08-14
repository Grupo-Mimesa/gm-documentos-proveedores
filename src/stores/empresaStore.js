import { reactive } from 'vue'

const STORAGE_KEY = 'empresaActiva'

const estadoInicial = {
  rif: '',
  razonSocial: '',
  ab: '',
  servicio: '',
  documentos2: []
}

const empresaGuardada = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')

export const empresaStore = reactive({
  datos: empresaGuardada || estadoInicial,

  setEmpresa(nuevosDatos) {
    this.datos = { ...this.datos, ...nuevosDatos }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.datos))
  },

  limpiarEmpresa() {
    localStorage.removeItem(STORAGE_KEY)
  }
})