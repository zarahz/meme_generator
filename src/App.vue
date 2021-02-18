<template>
  <div id="app">
    <div>
      <Navigation />
      <b-row align-h="center">
        <b-col md="8" cols="12">
          <router-view />
        </b-col>
      </b-row>
    </div>
  </div>
</template> 


// https://www.positronx.io/create-login-signup-ui-screens-in-vue-js-with-bootstrap/

<script>
import Navigation from "./components/Navigation/Navigation.vue";

export default {
  name: "App",
  components: {
    Navigation,
  },
  data() {
    return {
      mobileView: false,
      showNav: false,
      test: "Das ist ein Test",
    };
  },
  created() {
    this.$store.dispatch("tryLoadUser");
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 90px;
}
</style>
<style scoped>
.top-bar {
  width: 100%;
  background-color: #5cb85c;
  position: center;
}
</style>
