<template>
  <div>
    {{ test }}
  </div>
  <SubmitButton 
    :loading="false"
    @click="submit"
  />
</template>

<script lang="ts" setup>
import { userService } from '@/api/services/userService'
const submit = () => {
  userService.getProfile().then((data) => {
    console.log('data', data)
  }).catch((error) => {
    console.error('error', error)
  })
}


const test = ref(Math.random())

</script>
