<template>
  <v-card width="400px">
    <v-container>
      <v-card-text>
        <v-text-field 
          label="New Password" 
          :prepend-icon="mdiAccountCircle" 
          variant="outlined"
          v-model="password1"
          :type="showPassWord1 ? 'text' : 'password'"
          :clear-icon="mdiCloseCircle"
          clearable
          @click:clear="password1 = ''"
          :append-icon="showPassWord1 ? mdiEye : mdiEyeOff"
          @click:append="showPassWord1 = !showPassWord1"
          hide-details
        ></v-text-field>
        <v-text-field 
          label="Confirm New Password" 
          :prepend-icon="mdiLock"
          variant="outlined"
          v-model="password2"
          :type="showPassWord2 ? 'text' : 'password'"
          :clear-icon="mdiCloseCircle"
          clearable
          @click:clear="password2 = ''"
          :append-icon="showPassWord2 ? mdiEye : mdiEyeOff"
          @click:append="showPassWord2 = !showPassWord2"
          hide-details
          class="mt-2"
        ></v-text-field>
      </v-card-text>
      <div class="d-flex flex-row mt-3">
        <v-spacer></v-spacer>
        <v-btn color="accent" @click="clickChangePassword">変更</v-btn>
      </div>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
import { fetchAuthSession, signOut, confirmSignIn } from "aws-amplify/auth"
import { useRouter } from "vue-router" 
import { mdiAccountCircle, mdiCloseCircle, mdiLock, mdiEye, mdiEyeOff } from '@mdi/js'

  const password1 = ref('')
  const password2 = ref('')
  const router = useRouter()
  const showPassWord1 = ref(false)
  const showPassWord2 = ref(false)

  const clickChangePassword = async () => {
    if(password1.value !== password2.value){
      alert("パスワードが一致しません")
      return
    }
    try {
      // idTokenが存在する（サインイン済み）場合、サインアウトする
      const fetched = await fetchAuthSession()
      if (fetched.tokens?.idToken) {
          console.log("fetched", fetched)
          await signOut()
      }
  
      // 引数がオブジェクトになっている
      const result = await confirmSignIn({ challengeResponse: password1.value })
  
      if (result.nextStep.signInStep === 'DONE') {
        router.push('/tenants')
      } else {
        console.log("result", result)
        alert(`次のステップ: ${result.nextStep.signInStep}`);
      }
    } catch (error) {
      console.log(error)
    }
  }

</script>
