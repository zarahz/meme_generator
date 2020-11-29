<template>
  <div id="app">
    <!--img alt="Vue logo" src="./assets/logo.png"-->
    <CreateMeme />
    <!--HelloWorld :msg="test" /-->
  </div>
</template>

<script>
import CreateMeme from "./components/Create/CreateMeme.vue";
//import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    //HelloWorld,
    CreateMeme,
  },
  data() {
    return {
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
  color: #2c3e50;
  margin-top: 60px;
}
</style>
