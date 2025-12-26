<template>
  <BaseButton 
    class="font-weight-semibold"
    color="blue-darken-1"
    @click="$emit('click')"
    width="100"
    :disabled="disabled"
    variant="outlined"
  >
    詳 細
  </BaseButton>
</template>

<script lang="ts" setup>
defineProps<{
  disabled?: boolean
}>()
const emit = defineEmits<{
  (e: 'click'): void
}>()

</script>