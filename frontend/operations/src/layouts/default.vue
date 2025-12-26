<template>
  <TopAppBar @click="isDrawer = !isDrawer"/>
  <RouterNavigationDrower v-model="isDrawer"/>
  <v-main class="app-background">
    <router-view/>
  </v-main>
  <AppFooter />
</template>

<script lang="ts" setup>

  const isDrawer = ref(false)

</script>

<style>
.app-background {
  background-color: #eff4f7;
}
</style>