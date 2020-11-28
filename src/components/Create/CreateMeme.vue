<template>
  <b-container class="justify-content-md-center" fluid>
    <h1>Create a Meme!</h1>
    <b-row align-h="center">
      <b-col cols="2">
        <label>Top Text:</label>
      </b-col>
      <b-col cols="4">
        <p>
          <input
            v-model="topText"
            class="w-100"
            type="text"
            placeholder="Top Text..."
          />
          {{ topText }}
        </p>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="2">
        <label>Bottom Text:</label>
      </b-col>
      <b-col cols="4">
        <input
          v-model="bottomText"
          class="w-100"
          type="text"
          placeholder="Bottom Text..."
        />
        {{ bottomText }}
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <button v-on:click="buttonClick()">Do something</button>
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
import cassiusMeme from "../../assets/meme_small.jpg";

export default {
  name: "CreateMeme",
  props: {
    msg: String,
  },
  data() {
    return {
      topText: "",
      bottomText: "",

      img: cassiusMeme,
    };
  },
  methods: {
    buttonClick: function (event) {
      console.log("Button clicked");
      if (event) {
        alert(event.target.tagName);
      }
    },
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
button {
  margin: 25px 5px 20px 20px;
  color: #626c74;
}
</style>
