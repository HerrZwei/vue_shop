import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios // 挂载到Vue的原型对象上
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
