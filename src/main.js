import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"

axios.defaults.baseURL = 'http://127.0.0.1:8888/';
Vue.prototype.$http = axios;

// 将全局的echarts挂载到Vue的原型上
Vue.prototype.$echarts = window.echarts;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
