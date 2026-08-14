import { reactive } from 'vue'

// Cargar estado inicial desde localStorage si existe
const empresaGuardada = JSON.parse(localStorage.getItem('empresaActiva') || 'null')

export const empresaStore = reactive({
  // Datos de la empresa activa
  datos: empresaGuardada || {
    rif: '',
    razonSocial: '',
    ab: '',
    servicio: '',
    documentos2: []
  },

  // Método para actualizar los datos y guardarlos
  setEmpresa(nuevosDatos) {
    this.datos = { ...this.datos, ...nuevosDatos }
    localStorage.setItem('empresaActiva', JSON.stringify(this.datos))
  },

  // Método para limpiar los datos (si la empresa cierra sesión o cambia)
  limpiarEmpresa() {
    this.datos = {
      rif: '',
      razonSocial: '',
      ab: '',
      servicio: '',
      documentos2: []
    }
    localStorage.removeItem('empresaActiva')
  }
})