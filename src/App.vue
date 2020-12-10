<template>
  <div id="app">
    <div class="top-bar">
      <Navigation />
    </div>
    <CreateMeme />
    <OverviewPage />
  </div>

  <!--img alt="Vue logo" src="./assets/logo.png"-->
  <!-- <CreateMeme /> -->
  <!--HelloWorld :msg="test" /-->
</template>

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
  color: #5cb85c;
  margin-top: 0px;
}

.top-bar {
  width: 100%;
  background-color: #5cb85c;
  position: center;
}
</style>
