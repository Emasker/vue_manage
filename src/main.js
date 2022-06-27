import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index'
import './plugins/element.js'
Vue.config.productionTip = false

// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import 'default-passive-events'
import axios from 'axios'

//引入树状表格
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)

//挂载全局axios
Vue.prototype.$http = axios

//全局过滤器/日期
Vue.filter('dateFormat', function (originVal) {
  originVal = originVal * 1000
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') //长度不足两位补零
  const d = (dt.getDate() + 1 + '').padStart(2, '0')
  const hh = (dt.getHours() + 1 + '').padStart(2, '0')
  const mm = (dt.getMinutes() + 1 + '').padStart(2, '0')
  const ss = (dt.getSeconds() + 1 + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 全局挂载 VueQuillEditor
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

// 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// request 拦截器
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
}, error => {
  return Promise.reject(error);
});

//  response 拦截器
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')