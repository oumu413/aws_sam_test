<template>
  <v-data-table
    v-model="select"
    :items-per-page="itemsPerPage"
    :page="currentPage"
    :headers="headers"
    :items="items"
    :item-value="itemValue"
    :search="search"
    :custom-filter="customFilter" 
    :hide-default-footer="true"
    :multi-sort="true"
    select-strategy="single"
    show-select
    color="blue-darken-1"
  >
    <template #top>
      <div class="d-flex justify-space-between align-center pa-2 ga-4">
        <v-text-field
          v-model="search"
          label="検索"
          :prepend-inner-icon="mdiMagnify"
          variant="outlined"
          hide-details
          density="comfortable"
        />
        <v-checkbox
          v-model="exactMatch"
          label="完全一致"
          density="comfortable"
          hide-details
          color="blue-darken-1"
        />
        <div class="d-flex align-center ga-4">
          <div class="d-flex align-center ga-2">
            <v-select
              variant="outlined"
              v-model="itemsPerPage"
              :items="itemsPerPageOptions"
              item-value="value"
              item-title="title"
              density="compact"
              hide-details
              label="表示件数"
            />
          </div>
          <span class="text-caption">{{ pageText }}</span>
          <div class="d-flex align-center ga-2">
            <v-btn variant="text" :icon="mdiPageFirst"   :disabled="isFirstPage || itemsPerPage === -1" @click="goFirst" />
            <v-btn variant="text" :icon="mdiChevronLeft" :disabled="isFirstPage || itemsPerPage === -1" @click="prevPage" />
            <v-btn variant="text" :icon="mdiChevronRight":disabled="isLastPage  || itemsPerPage === -1" @click="nextPage" />
            <v-btn variant="text" :icon="mdiPageLast"    :disabled="isLastPage  || itemsPerPage === -1" @click="goLast" />
          </div>
        </div>
      </div>
    </template>
    <template #no-data>
      <div class="py-6 text-center">
        <div class="text-body-2 mb-2">
          検索条件「<strong>{{ search }}</strong>」に一致するデータがありません
        </div>
        <div class="text-caption text-medium-emphasis">
          条件を変更して再度お試しください
        </div>
      </div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'
import { mdiPageFirst, mdiPageLast, mdiChevronLeft, mdiChevronRight, mdiMagnify } from '@mdi/js'

type BaseItem = Record<string, unknown>

const props = defineProps<{
  headers: DataTableHeader<BaseItem>[]
  items: BaseItem[]
  itemValue: string
}>()
const select = defineModel<[]>({ default: [] })

const itemsPerPage = ref(10)
const currentPage  = ref(1)
const search       = ref('')
const exactMatch   = ref(false)

const itemsPerPageOptions = [
  { value: 10,  title: '10' },
  { value: 25,  title: '25' },
  { value: 50,  title: '50' },
  { value: 100, title: '100' },
]

// 全カラム（ヘッダーにないプロパティも）対象にするフィルタ
const filteredItems = computed<BaseItem[]>(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.items
  return props.items.filter(item =>
    Object.values(item).some(v => String(v ?? '').toLowerCase().includes(q))
  )
})

const customFilter = (value: string, query: string, item: any) => {
  if (value == null || query == null) return -1
  if (!query.length) return 0

  value = value.toString().toLocaleLowerCase()
  query = query.toString().toLocaleLowerCase()

  if(exactMatch.value){
    // 完全一致
    if (value === query) {
    return [[0, value.length] as const]
    }
    return -1 as const
  }
  else{
    // 前方一致
    const result = []
    let idx = value.indexOf(query)
    while (~idx) {
      result.push([idx, idx + query.length] as const)

      idx = value.indexOf(query, idx + query.length)
    }
    return result.length ? result : -1
  }
}

// 総ページ数は「表示中の件数」で計算
const totalPages = computed(() => {
  if (itemsPerPage.value === -1) return 1
  const total = filteredItems.value.length
  return Math.max(1, Math.ceil(total / itemsPerPage.value))
})

// 1-10 件 / XXX 件中（XXX は表示中の件数）
const pageText = computed(() => {
  const total = filteredItems.value.length
  if (total === 0) return '0-0 件 / 0 件中'
  if (itemsPerPage.value === -1) return `1-${total} 件 / ${total} 件中`
  const start = (itemsPerPage.value * (currentPage.value - 1)) + 1
  const end   = Math.min(itemsPerPage.value * currentPage.value, total)
  return `${start}-${end} 件 / ${total} 件中`
})

const isFirstPage = computed(() => currentPage.value <= 1)
const isLastPage  = computed(() => currentPage.value >= totalPages.value)

const goFirst = () => { if (!isFirstPage.value) currentPage.value = 1 }
const goLast  = () => { if (!isLastPage.value)  currentPage.value = totalPages.value }
const prevPage = () => { if (!isFirstPage.value) currentPage.value -= 1 }
const nextPage = () => { if (!isLastPage.value)  currentPage.value += 1 }

// 件数が変わったらページ範囲を補正
watch([itemsPerPage, filteredItems], () => {
  if (itemsPerPage.value === -1) {
    currentPage.value = 1
    return
  }
  const max = Math.max(1, Math.ceil(filteredItems.value.length / itemsPerPage.value))
  if (currentPage.value > max) currentPage.value = max
  if (currentPage.value < 1) currentPage.value = 1
})
</script>
