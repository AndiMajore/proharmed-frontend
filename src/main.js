import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

import '@mdi/font/css/materialdesignicons.css'

import * as CONFIG from "./Config"
import ApiService from "../services/api.service";

ApiService.init(CONFIG.HOST_URL + CONFIG.CONTEXT_PATH)

const app = createApp(App)

app.config.globalProperties.$config = CONFIG
app.config.globalProperties.$http = ApiService

app.use(router)
app.use(vuetify)

app.mount('#app')
