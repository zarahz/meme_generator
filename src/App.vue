<template>
  <div id="app">
    <div>
      <Navigation />
      <b-row class="justify-content-md-center w-100" align-h="center">
        <b-col md="8" cols="12">
          <router-view :key="$route.path" />
        </b-col>
      </b-row>
    </div>
  </div>
</template> 

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
