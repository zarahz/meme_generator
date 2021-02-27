import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import CreateMeme from "../components/CreateMeme/Container/CanvasCreateMeme.vue";
import FabricMeme from "../components/CreateMeme/Container/FabricMeme.vue";
import MemePage from "../components/Overview/MemePage.vue";
import OverviewPage from "../components/Overview/OverviewPage.vue";
import Login from "../components/Authenticate/Login.vue";
import Registration from "../components/Authenticate/Registration.vue";
import MyPage from "../components/Overview/MyPage";

import CreateMovingMeme from "../components/CreateMeme/Container/CreateMovingMeme.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: OverviewPage
  },
  {
    path: "/meme/:id",
    name: "MemePage",
    props: true,
    component: MemePage
  },
  {
    path: "/create-meme",
    name: "CreateMeme",
    component: CreateMeme,

  },
  {
    path: "/fabric-meme",
    name: "FabricMeme",
    component: FabricMeme,

  },
  {
    path: "/create-moving-meme",
    name: "CreateMovingMeme",
    component: CreateMovingMeme,

  },
  {
    path: "/my-page",
    name: "MyPage",
    component: MyPage,

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

