
import DefaultLayout from '../layouts/DefaultLayout.vue'

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
        component: () => import('../views/EmpleadosView.vue')
      },
      {
        path: 'vehiculos',
        name: 'Vehiculos',
        component: () => import('../views/VehiculosView.vue')
      }
    ]
  }
]

export default routes