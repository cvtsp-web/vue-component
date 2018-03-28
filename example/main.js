import Vue from 'vue'
import App from './App'
import CvtspUI from '@'

Vue.config.productionTip = false
Vue.use(CvtspUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  components: {App}
})
