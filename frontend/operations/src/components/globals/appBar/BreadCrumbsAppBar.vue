<template>
  <v-app-bar
    density="compact"
    :elevation="0"
  >
    <DefaultBreadcrumbs :items="breadcrumbsItems"/>
    <v-spacer />
    <div class="pa-4">
      <v-btn 
        :icon="mdiInformationOutline"
        variant="text"
        @click="$emit('click')"
      ></v-btn>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { mdiInformationOutline } from '@mdi/js'
defineProps<{
  breadcrumbsItems: {title:string,disabled:boolean,to:{path:string}}[]
}>()
const emit = defineEmits<{
  (e: 'click'): void
}>()

</script>