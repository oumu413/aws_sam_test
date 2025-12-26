<template>
  <BaseButton 
    class="font-weight-semibold"
    color="green-lighten-2" 
    @click="$emit('click')"
    width="150"
  >
    CSV 出 力
  </BaseButton>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'click'): void
}>()

</script>