<template>
  <v-card width="400px">
    <v-container>
      <v-card-text>
        <v-text-field 
          label="User Name" 
          :prepend-icon="mdiAccountCircle" 
          variant="outlined"
          v-model="userName"
          type="text"
          :clear-icon="mdiCloseCircle"
          clearable
          @click:clear="userName = ''"
          hide-details
        ></v-text-field>
        <v-text-field 
          label="Password" 
          :prepend-icon="mdiLock"
          variant="outlined"
          v-model="password"
          :type="showPassWord ? 'text' : 'password'"
          :clear-icon="mdiCloseCircle"
          clearable
          @click:clear="password = ''"
          :append-icon="showPassWord ? mdiEye : mdiEyeOff"
          @click:append="showPassWord = !showPassWord"
          hide-details
          class="mt-2"
        ></v-text-field>
      </v-card-text>
      <div class="d-flex flex-row mt-3">
        <v-spacer></v-spacer>
        <v-btn color="accent" @click="clickSignIn">サインイン</v-btn>
      </div>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
import { fetchAuthSession, signOut, signIn } from "aws-amplify/auth"
import { mdiAccountCircle, mdiCloseCircle, mdiLock, mdiEye, mdiEyeOff } from '@mdi/js'

  const userName = ref('')
  const password = ref('')
  const showPassWord = ref(false)

  const router = useRouter()
  const clickSignIn = async () => {
    try {
      // idTokenが存在する（サインイン済み）場合、サインアウトする
      const fetched = await fetchAuthSession()
      if (fetched.tokens?.idToken) {
          console.log("fetched", fetched)
          await signOut()
      }
  
      // 引数がオブジェクトになっている
      const result = await signIn({ username: userName.value, password: password.value })
  
      if (result.nextStep.signInStep === 'DONE') {
        router.push('/home')
      }
      else if(result.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'){
        router.push('/new-password')
      } 
      else {
        console.log("result", result)
        alert(`次のステップ: ${result.nextStep.signInStep}`);
      }
    } catch (error) {
      console.log(error)
    }
  }

</script>
