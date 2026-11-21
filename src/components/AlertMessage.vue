<script setup>
import AppIcon from './AppIcon.vue'
const props = defineProps({ type: { type: String, default: 'danger' }, message: { type: String, required: true }, closable: Boolean })
defineEmits(['close'])
const icon = { success: 'check', warning: 'alert', danger: 'alert' }
</script>

<template>
  <div :class="['alert', props.type]" role="alert">
    <AppIcon :name="icon[props.type] || 'alert'" :size="18" />
    <span class="msg">{{ message }}</span>
    <button v-if="closable" class="x" @click="$emit('close')" aria-label="Tutup">✕</button>
  </div>
</template>
