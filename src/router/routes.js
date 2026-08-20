
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { empresaStore } from '@/stores/empresaStore.js'

const authGuard = (to, from, next) => {
  
  const isValidated = empresaStore.datos.servicio && empresaStore.datos.rif && empresaStore.datos.razonSocial;
  if (!isValidated) return next('/empresa')
  
  next()
}

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        redirect: '/empresa'
      },
      {
        path: 'empresa',
        name: 'Empresa',
        component: () => import('../views/EmpresaView.vue')
      },
      {
        path: 'empleados',
        name: 'Empleados',
        component: () => import('../views/EmpleadosView.vue'),
        beforeEnter: authGuard
      },
      {
        path: 'vehiculos',
        name: 'Vehiculos',
        component: () => import('../views/VehiculosView.vue'),
        beforeEnter: authGuard
      }
    ]
  }
]

export default routes