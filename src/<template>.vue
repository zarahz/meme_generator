<template>
  <div id="app">
    <div class="top-bar">
      <Navigation />
    </div>
    <CreateMeme />
  </div>

  <!--img alt="Vue logo" src="./assets/logo.png"-->
  <!-- <CreateMeme /> -->
  <!--HelloWorld :msg="test" /-->
</template> 


<template>
  <div class="vue-tempalte">
    <!-- Navigation -->
    <nav class="navbar shadow bg-white rounded justify-content-between flex-nowrap flex-row fixed-top">
      <div class="container">
        <a class="navbar-brand float-left" href="https://www.positronx.io" target="_blank">
           positronX.io
        </a>
        <ul class="nav navbar-nav flex-row float-right">
          <li class="nav-item">
            <router-link class="nav-link pr-3" to="/login">Sign in</router-link>
          </li>
          <li class="nav-item">
            <router-link class="btn btn-outline-primary" to="/">Sign up</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Main -->
    <div class="App">
      <div class="vertical-center">
        <div class="inner-block">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

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
