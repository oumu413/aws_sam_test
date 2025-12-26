<template>
  test
  <div>
    {{ test }}
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  meta: {
    layout: 'Default'
  }
})


const test = ref(Math.random())
</script>
