<template>
  tenants
  <div>
    {{ test }}
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  meta: {
    layout: 'auth'
  }
})


const test = ref(Math.random())
</script>
