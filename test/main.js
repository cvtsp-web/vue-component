import Vue from 'vue'
import App from './App'
import router from './router'
import CvtspUI from '@'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(CvtspUI)
Vue.use(ElementUI, {size: 'small'});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  components: {App}
})
