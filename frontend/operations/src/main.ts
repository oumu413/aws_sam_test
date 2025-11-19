/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'

// AWS Amplify
import { Amplify } from "aws-amplify"
Amplify.configure({
  Auth: {
    Cognito: {
        userPoolId: import.meta.env.VITE_OPERATIONS_APP_AWS_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_OPERATIONS_APP_AWS_USER_POOL_WEB_CLIENT_ID,
    },
  },
})


const app = createApp(App)

registerPlugins(app)

app.mount('#app')
