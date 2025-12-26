<template>
  <v-breadcrumbs :items="items">
    <template v-slot:divider>
      <v-icon :icon="mdiChevronRight"></v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { mdiChevronRight } from '@mdi/js'

interface BreadcrumbItem {
  title: string
  disabled?: boolean
  href?: string
}

const props = defineProps<{
  items: BreadcrumbItem[]
}>()
</script>