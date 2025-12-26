<template>
  <DefaultBreadcrumbs :items="breadcrumbsItems"/>
  まだ何もない
  <SubmitButton
    :loading="false"
    @click="submit"
  />
</template>

<script setup lang="ts">
const router = useRouter()

const submit = () => {
  router.push('/tenants')
}

definePage({
  meta: {
    layout: 'Default',
  }
})
const breadcrumbsItems = [
  {
    title: 'ホーム',
    disabled: true,
    to: { path: '/home' },
  },
]

</script>
