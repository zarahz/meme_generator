import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import CreateMeme from "../components/Create/CreateMeme.vue";
import Meme from "../components/Overview/Meme.vue";
import OverviewPage from "../components/Overview/OverviewPage.vue";
// import Login from "../components/Authenticate/Login.vue";
import Login from "../components/Overview/Login.vue"
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

