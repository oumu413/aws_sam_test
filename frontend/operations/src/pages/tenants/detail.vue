<template>
  <BreadCrumbsAppBar 
    :breadcrumbsItems="breadcrumbsItems" 
    @click="isDrawer = !isDrawer" 
  />
  <InformationNabigationDrower 
    v-model="isDrawer"
    :text="text"
  />
  <Test/>
</template>

<script setup lang="ts">
  
const isDrawer = ref(false)

const text = `
東京周辺で賃貸マンションをお探しなら、巣鴨は大変お勧めです。巣鴨駅はJR山手線と三田線が利用できる
ため、東京の主要地域におおよそ30分程度で着くことが出来ます。また、新宿や池袋にいたっては、
15分以内に着きます。地方から東京に来る方であれば、まだまだ生活に慣れないことも多いと思うので、
なるべくなら、乗り換えが少なくすむ山手線沿線に住むのがおすすめです。
さらに、巣鴨の賃貸マンションは比較的に安く、且つ治安も良い場所です。家賃が安いと治安も悪いのでは
というイメージがもたれがちですが、巣鴨ではそのようなことはありませんので、女性には特におすすめです。
また、巣鴨周辺は立地条件がよいのも特徴です。JR巣鴨駅の近くは非常に栄えていますので、スーパーや
コンビニも多くあり、深夜の買い物にも困りません。また居酒屋や飲食店も多く、暮らしに便利です。
駅には駐輪場も設置されており、巣鴨の隣駅の西巣鴨の賃貸マンションに住んでいても、自転車で5分程度で
巣鴨駅に着きます。
但し、1つだけ注意したい点は巣鴨の賃貸マンションは古い物件が多いので、借りる際には必ず、建てられた
年数や、建物の材質などは良くチェックしておいたほうがよいでしょう。(511文字
`

const breadcrumbsItems = [
  {
    title: 'テナント',
    disabled: false,
    to: { path: '/tenants' },
  },
  {
    title: '詳細',
    disabled: true,
    to: { path: '/tenants/detail' },
  },
]

definePage({
  meta: {
    layout: 'Default',
  }
})
</script>
