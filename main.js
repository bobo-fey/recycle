import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import HttpRequest from './common/request'
import queue from './common/queue'
import store from './store'
import aes from './common/crypto' //加解密
import manba from './node_modules/manba/manba.js' //时间戳转换

Vue.use(uView);

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$zshs = HttpRequest;  //请求方法
Vue.prototype.$queue = queue;  //工具类
Vue.prototype.$aes = aes  //加解密
Vue.prototype.$manba = manba //转换时间戳

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
