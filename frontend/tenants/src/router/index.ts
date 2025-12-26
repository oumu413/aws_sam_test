/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

import { fetchAuthSession, signOut } from 'aws-amplify/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})


router.beforeEach(async (to, from, next) => {
  // ログインページは認証不要
  if (to.path === '/login') {
    next()
    return
  }

  // 直接アクセスかどうかを判定
  const isDirectAccess = !from.name

  if(to.path === '/new-password'){
    if (!isDirectAccess) {
      next() // 新しいパスワード設定画面は認証不要+直接入力は不可
      return
    }
  }

  try {
    const session = await fetchAuthSession () // 認証済みならOK
    if (session.tokens?.idToken) {
      next() // 認証済み
    } else {
      await signOut()
      next('/login') // トークンなし → ログイン画面へ
    }
  } catch (error) {
    await signOut()
    next('/login') // 未認証ならログイン画面へ
  }
})


// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((error, to) => {
  if (error?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', error)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(error)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
