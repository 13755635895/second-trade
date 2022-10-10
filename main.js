
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import uView from '@/uni_modules/uview-ui'
import api from '@/api/api.js'
Vue.use(uView)

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$api = api
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif