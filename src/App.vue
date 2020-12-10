<template>
  <div id="app">
    <div class="top-bar">
      <Navigation />
    </div>
    <CreateMeme />
    <div class="vertical-center">
        <div class="inner-block">
            <router-view />
        </div>
    </div>
  </div>
</template> 


// https://www.positronx.io/create-login-signup-ui-screens-in-vue-js-with-bootstrap/

<script>
import CreateMeme from "./components/Create/CreateMeme.vue";
//import HelloWorld from "./components/HelloWorld.vue";
import Navigation from "./components/Navigation/Navigation.vue";

export default {
  name: "App",
  components: {
    //HelloWorld,
    CreateMeme,
    Navigation,
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
  color: #5cb85c;
  margin-top: 0px;
}

.top-bar {
  width: 100%;
  background-color: #5cb85c;
  position: center;
}
</style>
