<template>
  <v-navigation-drawer
    v-model="isDrawer"
    location="right"
  >
    <div class="pa-4">
      {{ text }}
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
const isDrawer = defineModel<boolean>({ default: false })

</script>