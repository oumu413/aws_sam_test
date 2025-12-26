<template>
  <BaseTextField
    v-model="model"
    :rules="subdomainRules"
  />
</template>

<script setup lang="ts">

const model = defineModel<string>({ default: '' })

// 文字数チェック（1〜20文字）
const lengthRules = [
  // 入力必須（空文字や未入力を不可）
  (v: string) => !!v || '1 文字以上で入力してください',
  // 最小文字数
  (v: string) => (v?.length ?? 0) >= 1 || '1 文字以上で入力してください',
  // 最大文字数
  (v: string) => (v?.length ?? 0) <= 20 || '20 文字以下で入力してください',
]

// 許容文字とハイフン位置のチェック
const patternRules = [
  // 許容文字：英字・数字・ハイフンのみ
  (v: string) =>
    /^[a-z0-9-]+$/i.test(v) ||
    '英字・数字・ハイフンのみ使用できます',
  // 先頭がハイフン不可
  (v: string) => !/^-/.test(v) || 'ハイフンで開始できません',
  // 末尾がハイフン不可
  (v: string) => !/-$/.test(v) || 'ハイフンで終了できません',
]

// まとめて使う rules
const subdomainRules = [
  ...lengthRules,
  ...patternRules,
]

</script>