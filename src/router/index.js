import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import CreateMeme from "../components/Create/CreateMeme.vue";
import Meme from "../components/Overview/Meme.vue";
import OverviewPage from "../components/Overview/OverviewPage.vue";
import Login from "../components/Authenticate/Login.vue";
import Registration from "../components/Authenticate/Registration.vue";
import ForgotPassword from "../components/Authenticate/ForgotPassword.vue";


const routes = [
  {
    path: "/",
    name: "Home",
    component: OverviewPage
  },
  {
    path: "/meme/:id",
    name: "Meme",
    props: true,
    component: Meme
  },
  {
    path: "/create-meme",
    name: "CreateMeme",
    component: CreateMeme,

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
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
];
export default new VueRouter({ mode: "history", routes: routes });

