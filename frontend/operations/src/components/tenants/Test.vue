<template>
  <div>
    {{ test }}
  </div>
  <SubmitButton 
    :loading="false"
    @click="submit"
  />
  <DomeinNameTextField
    v-model="text"
  />
  <SubmitButton 
    :loading="false"
    @click="submit2"
  />
  <SubmitButton 
    :loading="false"
    @click="submit3"
  />
  <SubmitButton 
    :loading="false"
    @click="submit4"
  />
  <SubmitButton 
    :loading="false"
    @click="submit5"
  />
  <SubmitButton 
    :loading="false"
    @click="submit6"
  />
  <SubmitButton 
    :loading="false"
    @click="submit7"
  />

</template>

<script setup lang="ts">
import { userService } from '@/api/services/userService'
import { tenantManagementService } from '@/api/services/tenantManagementService'

const text = ref('')
const router = useRouter()

const submit = () => {
  userService.getProfile().then((data) => {
    console.log('data', data)
  }).catch((error) => {
    console.error('error', error)
  })
}

const submit2 = () => {
  tenantManagementService.createRoute53(text.value).then((data) =>{
    console.log('data', data)
  }).catch((error) => {
    console.error('error', error)
  })
} 

const submit3 = () => {
  tenantManagementService.deleteRoute53(text.value).then((data) =>{
    console.log('data', data)
  }).catch((error) => {
    console.error('error', error)
  })
} 

const submit4 = () => {
  tenantManagementService.createCognito(text.value).then((data) => {
    console.log('data', data)
  }).catch((error) => {
    console.error('error', error)
  })
}

const submit5 = () => {
  tenantManagementService.deleteCognito(text.value).then((data) => {
    console.log('data', data)
  }).catch((error) => {
    console.error('error', error)
  })
}
const submit6 = () => {
  router.push('/tenants/create')
}
const submit7 = () => {
  router.push('/tenants')
}


const test = ref(Math.random())

</script>
