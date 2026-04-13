import { createRouter, createWebHistory } from 'vue-router'
import * as CONFIG from "./Config"
import Validation from "@/components/Validation.vue"
import About from "@/components/About.vue"

const router = createRouter({
  history: createWebHistory(CONFIG.PATH_PREFIX),
  routes: [
    { path: "/", component: Validation },
    { path: "/configure", component: Validation },
    { path: "/result", component: Validation },
    { path: "/about", component: About }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
