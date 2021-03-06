// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import moment from 'moment';
import config from './config'
import './assets/css/bootstrap.min.css'
import './assets/css/font-awesome.min.css'
import './assets/css/reset.css'
import './assets/js/filter'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import LightTimeline from 'vue-light-timeline';
import '../static/ueditor/ueditor.config'
import '../static/ueditor/ueditor.all.min'
import '../static/ueditor/lang/zh-cn/zh-cn'
import '../static/ueditor/ueditor.parse.min'

Vue.use(LightTimeline)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$moment = moment
Vue.prototype.config = config

// http请求拦截器
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => {// 响应成功关闭loading
  if (data.data.code == 8) {
    router.push('/login')
  } else {
    return data
  }
}, error => {
  return Promise.reject(error)
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
