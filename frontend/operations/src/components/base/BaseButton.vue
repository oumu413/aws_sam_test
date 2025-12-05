<template>
  <v-btn :color="color" :loading="loading" @click="$emit('click')">
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
defineProps<{
  color?: string
  loading?: boolean
}>()
const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>
