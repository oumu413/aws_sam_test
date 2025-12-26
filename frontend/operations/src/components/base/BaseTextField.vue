<template>
  <v-text-field
    v-model="model"
    :label="label"
    :type="type"
    :disabled="disabled"
    :rules="rules"
    variant="outlined"
    density="comfortable"
    clearable
  />
</template>

<script setup lang="ts">
const model = defineModel<string>({ default: '' })
  
const props = withDefaults(defineProps<{
  label?: string
  type?: string
  disabled?: boolean
  rules?: ((v: any) => true | string)[]
}>(), {
  type: 'text',
  disabled: false,
  rules: () => [],
})



</script>