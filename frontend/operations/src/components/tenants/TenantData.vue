<template>
  <div class="pa-4">
    <v-card class="pa-4" variant="flat" rounded="xl">
      <div class="d-flex justify-space-between align-center pa-2 ga-4">
        <div class="text-h5 font-weight-black">
          テナント
        </div>
        <div class="d-flex align-center ga-2">
          <DetailButton @click="" :disabled="isDetailButtonDisabled"></DetailButton>
          <CSVExportButton @click=""></CSVExportButton>
          <CreateButton to="/tenants/create"></CreateButton>
        </div>
      </div>
      <BaseDataTable
        v-model="select"
        :headers="headers"
        :items="items"
        itemValue="id"
      >
      </BaseDataTable>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'

const select = ref<[]>([])

const headers = ref<DataTableHeader[]>([
  { title: 'ID', value: 'id', sortable: true, width: 80 },
  { title: '名称', value: 'name', sortable: true },
  { title: 'ステータス', value: 'status', sortable: true },
  { title: '作成日', value: 'createdAt', sortable: true },
])

const isDetailButtonDisabled = computed(() => {
  if(select.value.length == 0)return true
  else return false
})


const items = ref(
  Array.from({ length: 137 }).map((_, i) => ({
    id: i + 1,
    name: `あTenant ${i + 1}`,
    status: i % 2 === 0 ? 'Active' : 'Inactive',
    createdAt: new Date(2025, 0, 1 + i).toISOString().slice(0, 10),
  }))
)
</script>
