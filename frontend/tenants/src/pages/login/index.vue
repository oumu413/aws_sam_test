<template>
  <v-container class="d-flex flex-row justify-center">
    <LoginForm />
  </v-container>
</template>

<script lang="ts" setup>
import { Amplify } from "aws-amplify"
import { initService } from '@/api/services/initService'

initService.getCognitoConfig().then((data) => {
  Amplify.configure({
    Auth: {
      Cognito: {
          userPoolId: data.userPoolId,
          userPoolClientId: data.userPoolClientId,
      },
    },
  })
}).catch((error) => {
  console.error('error', error)
})

defineOptions({
  meta: {
    layout: 'Auth'
  }
})
</script>
