<template>
  <BaseButton color="blue" :loading="loading" @click="$emit('click')">
    送信
  </BaseButton>
</template>

<script lang="ts" setup>
defineProps<{
  loading: boolean
}>()
const emit = defineEmits<{
  (e: 'click'): void
}>()

</script>