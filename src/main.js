import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'es6-promise/auto'
import SocialSharing from "vue-social-sharing"
//import router from "./router/index"
import Vuex from 'vuex'
import store from './store/store'

Vue.use(Vuex)


// Install BootstrapVue
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false

Vue.use(SocialSharing);
Vue.c

new Vue({
  router,
  store,
  el: '#app',

  render: h => h(App),
}).$mount('#app')
