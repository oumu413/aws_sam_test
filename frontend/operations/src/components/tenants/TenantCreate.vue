<template>
  <div class="pa-4">
    <div class="text-h5 pa-4">
      テナントを作成
    </div>
    <v-card class="pa-4" variant="flat" rounded="xl">
      <div class="text-h6 font-weight-black">
        必須設定
      </div>
      <div class="pa-4">
        <div class="text-caption font-weight-black">サブドメイン名</div>
          <SubDomeinNameTextField
            v-model="text"
            width="400"
          />
          <div class="text-caption text-grey">
            3～63 文字で、有効な文字は a～z、0～9、ハイフン (-) です。先頭と末尾にハイフン（-）は使用できません。大文字は小文字に変換されます。
          </div>
      </div>
      <div class="text-h7">
        利用者様がアクセスするためのサブドメインを設定します。大文字と小文字は区別されません。
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { userService } from '@/api/services/userService'
import { tenantManagementService } from '@/api/services/tenantManagementService'

const text = ref('')


const test = ref(Math.random())

</script>
