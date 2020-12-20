<template>
  <div id="app">
    <div >
    <router-view/>
    <Navigation />
    </div>
    <CreateMeme />
    <OverviewPage/>
    <div class="vertical-center">
        <div class="inner-block">
            <router-view />
        </div>
    </div>
    
    <!--CreateMeme /-->
    <!--OverviewPage /-->
  </div>
</template> 


// https://www.positronx.io/create-login-signup-ui-screens-in-vue-js-with-bootstrap/

<script>
import CreateMeme from "./components/Create/CreateMeme.vue";
//import HelloWorld from "./components/HelloWorld.vue";
import Navigation from "./components/Navigation/Navigation.vue";
import OverviewPage from "./components/Overview/OverviewPage.vue";


export default {
  name: "App",
  components: {
    //HelloWorld,
    CreateMeme,
    Navigation,
    OverviewPage,
    //Content
  },
  data() {
    return {
      mobileView: false,
      showNav: false,
      test: "Das ist ein Test",
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 70px;
}
</style>
<style scoped>
.top-bar {
  width: 100%;
  background-color: #5cb85c;
  position: center;
}
</style>
