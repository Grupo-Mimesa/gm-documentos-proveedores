<template>
  <div class="localidad-multiselect position-relative" ref="dropdownRef">
    <!-- Botón activador del desplegable -->
    <button
      type="button"
      class="form-select text-start d-flex justify-content-between align-items-center bg-white"
      :class="{ 'is-invalid': error }"
      :disabled="disabled"
      @click="toggleDropdown"
    >
      <span class="text-truncate" v-if="modelValue.length === 0">
        <span class="text-muted">{{ placeholder }}</span>
      </span>
      <span class="text-truncate fw-semibold" v-else>
        {{ modelValue.length }} seleccionada(s)
      </span>
    </button>

    <!-- Menú Desplegable con Checkboxes -->
    <div
      v-if="abierto"
      class="dropdown-menu show p-2 w-100 shadow-sm border"
      style="max-height: 220px; overflow-y: auto; z-index: 1060;"
    >
      <div
        v-for="opcion in opciones"
        :key="opcion.Value"
        class="form-check py-1 px-2 rounded hover-bg"
        style="cursor: pointer;"
        @click.stop="toggleSeleccion(opcion.Value)"
      >
        <input
          class="form-check-input ms-0 me-1"
          type="checkbox"
          :id="'check-' + opcion.Value"
          :checked="estaSeleccionado(opcion.Value)"
          @click.stop="toggleSeleccion(opcion.Value)"
        />
        <label
          class="form-check-label w-99 ms-1 user-select-none"
          :for="'check-' + opcion.Value"
          style="cursor: pointer;"
        >
          {{ opcion.Label }}
        </label>
      </div>

      <div v-if="opciones.length === 0" class="text-muted text-center py-2 small">
        No hay localidades disponibles
      </div>
    </div>

    <!-- Badges / Chips de elementos seleccionados -->
    <div v-if="mostrarChips && modelValue.length > 0" class="d-flex flex-wrap gap-1 mt-2">
      <span
        v-for="item in modelValue"
        :key="item.Value"
        class="badge bg-primary d-flex align-items-center gap-1 py-1 px-2"
        style="font-size: 0.8rem;"
      >
        {{ obtenerLabel(item.Value) }}
        <i
          class="bi bi-x-circle-fill"
          role="button"
          style="cursor: pointer;"
          @click.stop="removerItem(item.Value)"
          title="Eliminar"
        ></i>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  // Arreglo en formato [{ Value: 'VAL' }]
  modelValue: {
    type: Array,
    default: () => []
  },
  // Catálogo de opciones [{ Label: 'Valencia', Value: 'VAL' }]
  opciones: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Seleccionar localidades...'
  },
  mostrarChips: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const abierto = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  if (!props.disabled) {
    abierto.value = !abierto.value
  }
}

// Comprueba si el valor ya existe en el modelValue
const estaSeleccionado = (val) => {
  return props.modelValue.some((item) => item.Value === val)
}

// Agrega o remueve el objeto [{ Value }] y emite el nuevo array
const toggleSeleccion = (val) => {
  let nuevaSeleccion = [...props.modelValue]
  const index = nuevaSeleccion.findIndex((item) => item.Value === val)

  if (index >= 0) {
    nuevaSeleccion.splice(index, 1)
  } else {
    nuevaSeleccion.push({ Value: val })
  }

  emit('update:modelValue', nuevaSeleccion)
}

// Remover directamente desde el chip/badge
const removerItem = (val) => {
  const nuevaSeleccion = props.modelValue.filter((item) => item.Value !== val)
  emit('update:modelValue', nuevaSeleccion)
}

// Obtener el Label descriptivo a partir del Value
const obtenerLabel = (val) => {
  const encontrado = props.opciones.find((opt) => opt.Value === val)
  return encontrado ? encontrado.Label : val
}

// Cierre automático al hacer clic afuera del componente
const handleClickAfuera = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    abierto.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickAfuera)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickAfuera)
})
</script>

<style scoped>
.hover-bg:hover {
  background-color: #f1f5f9;
}
</style>