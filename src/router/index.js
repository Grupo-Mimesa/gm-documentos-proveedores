import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.onError((error, to) => {
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    // Si falla la carga del chunk por desfase de despliegue, recarga la página
    window.location.href = to.fullPath
  }
})

export default router