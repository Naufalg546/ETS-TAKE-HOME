<script setup>
import AppIcon from './AppIcon.vue'
defineProps({ label: String, value: [String, Number], icon: { type: String, default: 'box' }, tone: { type: String, default: 'primary' } })
</script>

<template>
  <div class="card stat">
    <div :class="['stat-icon', 'tone-' + tone]"><AppIcon :name="icon" :size="22" /></div>
    <div>
      <div class="label">{{ label }}</div>
      <div class="value">{{ value }}</div>
    </div>
  </div>
</template>
