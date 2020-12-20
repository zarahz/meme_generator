import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import SocialSharing from "vue-social-sharing"
//import router from "./router/index"


// Install BootstrapVue
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false

Vue.use(SocialSharing);
Vue.c

new Vue({
  router,
  el: '#app',

  render: h => h(App),
}).$mount('#app')
