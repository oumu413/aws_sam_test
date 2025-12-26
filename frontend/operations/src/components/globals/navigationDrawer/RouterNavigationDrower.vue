<template>
  <v-navigation-drawer
    v-model="isDrawer"
  >
    <v-list>
      <v-list-subheader>メイン</v-list-subheader>
      <v-list-item to="/tenants">
        <v-list-item-title>
          <v-icon start :icon="mdiOfficeBuilding"></v-icon>
          テナント
        </v-list-item-title>
      </v-list-item>
      <v-list-subheader>その他</v-list-subheader>
      <v-list-item to="/test">
        <v-list-item-title>
          <v-icon start :icon="mdiOfficeBuilding"></v-icon>
          
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        @click="logoutClickButton"
        class="pointer"
      >
        <v-list-item-title class="text-red">
          <v-icon start :icon="mdiLogout" color="red"></v-icon>
          ログアウト
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { mdiLogout, mdiOfficeBuilding } from '@mdi/js'

const isDrawer = defineModel<boolean>({ default: false })
  
const router = useRouter()
      

  const logoutClickButton = () => {
  }

</script>