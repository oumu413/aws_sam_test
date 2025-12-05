<template>
  <v-container class="fill-height d-flex flex-column justify-center align-center text-center">
    <v-icon size="96" color="primary">mdi-alert-circle-outline</v-icon>
    <h1 class="text-h3 font-weight-bold mt-4">404 - Page Not Found</h1>
    <p class="text-subtitle-1 mb-6">
      お探しのページは存在しません。URLをご確認ください。
    </p>
    <v-btn color="primary" variant="elevated" @click="goHome">
      ログイン画面へ戻る
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { signOut } from "aws-amplify/auth"
defineOptions({
  meta: {
    layout: 'Auth'
  }
})

const router = useRouter()
const goHome = () => {
  signOut()
  router.push('/login')
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>