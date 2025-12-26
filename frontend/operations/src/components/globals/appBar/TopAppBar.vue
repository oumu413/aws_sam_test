<template>
  <v-app-bar
    density="compact"
    :elevation="0"
    color="blue"
  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="$emit('click')"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>あいうえおAIUEO</v-app-bar-title>
    <template v-slot:append>
      <v-btn icon="mdi-dots-vertical"></v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click'): void
}>()

const isDrawer = defineModel<boolean>({ default: false })
  
const router = useRouter()
      

  const logoutClickButton = () => {
  }

</script>