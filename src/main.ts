// import type { UserModule } from './types'
// import { ViteSSG } from 'vite-ssg'

// import "~/styles/element/index.scss";

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import ElementPlus from 'element-plus'
import zhTw from 'element-plus/es/locale/lang/zh-tw'

import { createApp } from 'vue'
// import all element css, uncommented next line
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import '~/axios-config'
import App from './App.vue'
import 'element-plus/dist/index.css'
import '~/styles/index.scss'
import 'uno.css'
// If you want to use ElMessage, import it.
import 'element-plus/theme-chalk/src/message.scss'

import 'element-plus/theme-chalk/src/message-box.scss'

const app = createApp(App)
app.use(createRouter({
  history: createWebHistory(),
  routes,
}))
app.use(ElementPlus, {
  locale: zhTw,
})
app.mount('#app')

// https://github.com/antfu/vite-ssg
// export const createApp = ViteSSG(
//   App,
//   {
//     routes,
//     base: import.meta.env.BASE_URL,
//   },
//   (ctx) => {
//     // install all modules under `modules/`
//     Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
//       .forEach(i => i.install?.(ctx))
//     // ctx.app.use(Previewer)
//   },
// )
