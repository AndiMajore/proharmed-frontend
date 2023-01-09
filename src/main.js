import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueRouter from 'vue-router'

import '@mdi/font/css/materialdesignicons.css'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import * as CONFIG from "./Config"
import ApiService from "../services/api.service";
import vuetify from './plugins/vuetify'

ApiService.init(CONFIG.HOST_URL+CONFIG.CONTEXT_PATH)

Vue.prototype.$config=CONFIG
Vue.prototype.$http = ApiService
Vue.use(VueRouter)

Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
