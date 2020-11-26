<template>
  <b-container class="justify-content-md-center" fluid>
    <h1>Create a Meme!</h1>
    <b-row align-h="center">
      <b-col cols="2">
        <label>Top Text:</label>
      </b-col>
      <b-col cols="4">
        <input
          class="w-100"
          type="text"
          placeholder="Type in the top Text..."
        />
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="2">
        <label>Bottom Text:</label>
      </b-col>
      <b-col cols="4">
        <input
          class="w-100"
          type="text"
          placeholder="Type in the bottom Text..."
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <img :src="img" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import vueLogo from "../../assets/logo.png";

export default {
  name: "CreateMeme",
  props: {
    msg: String,
  },
  data() {
    return {
      img: vueLogo,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
