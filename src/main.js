import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import 'default-passive-events'
import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
}, error => {
  return Promise.reject(error);
});
//引入树状表格
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)
//挂载全局axios
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')