<<<<<<< HEAD
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../App.vue')
  },
  {
    path: '/',
    name: 'signup',
    component: () => import('../components/Overview/Signup.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/Overview/Login.vue')
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../components/Overview/ForgotPassword.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
=======
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import CreateMeme from "../components/Create/CreateMeme.vue";
import Meme from "../components/Overview/Meme.vue";
import OverviewPage from "../components/Overview/OverviewPage.vue";
import Login from "../components/Authenticate/Login.vue";
import Registration from "../components/Authenticate/Registration.vue";


const routes = [
  {
    path: "/",
    name: "Home",
    component: CreateMeme
  },
  {
    path: "/meme/:id",
    name: "Meme",
    props: true,
    component: Meme
  },
  {
    path: "/overviewpage",
    name: "OverviewPage",
    component: OverviewPage,

  },
  {
    path: "/login",
    name: "Login",
    component: Login,

  },
  {
    path: "/registration",
    name: "Registration",
    component: Registration,

  },
];
export default new VueRouter({ mode: "history", routes: routes });
>>>>>>> 71216724b9ebe70a2ea8bb1528abbd4fc232f08a
