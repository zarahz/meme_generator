import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import CreateMeme from "../components/Create/CreateMeme.vue";
import Meme from "../components/Overview/Meme.vue";
import OverviewPage from "../components/Overview/OverviewPage.vue";


   const routes = [
      {
        path: "/",
        name: "Home",
        component: CreateMeme
      },
      {
        path: "/meme",
        name: "Meme",
        component: Meme
      },
      {
        path: "/overviewpage",
        name: "OverviewPage",
        component: OverviewPage,
        
      },
    ];
     export default new VueRouter ({mode: "history", routes: routes});
  