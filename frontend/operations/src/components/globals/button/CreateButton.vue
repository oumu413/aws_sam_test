<template>
  <BaseButton 
    class="font-weight-semibold"
    color="orange" 
    @click="$emit('click')"
    width="100"
  >
    作 成
  </BaseButton>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'click'): void
}>()

</script>