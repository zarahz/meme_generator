<template>
  <b-container class="justify-content-md-center" fluid>
    <h2>Pick a template!</h2>

    <b-row align-h="center">
      <b-col cols="1">
        <img
          style="width: 50%"
          class="image"
          v-for="(image, i) in images"
          :src="image"
          :key="i"
          @click="selectMemeTemplate(i)"
        />
        <vue-gallery-slideshow
          :images="images"
          :index="null"
          @close="index = null"
        >
        </vue-gallery-slideshow>
      </b-col>
    </b-row>
    <b-row align-h="center">asdf </b-row>
  </b-container>
</template>

<script>
import axios from "axios";
import VueGallerySlideshow from "vue-gallery-slideshow";

export default {
  name: "Templates",
  props: {
    searchString: String,
  },
  components: {
    VueGallerySlideshow,
  },
  data() {
    return {
      images: [
        "https://placekitten.com/801/800",
        "https://placekitten.com/802/800",
        "https://placekitten.com/803/800",
        "https://placekitten.com/804/800",
        "https://placekitten.com/805/800",
        "https://placekitten.com/806/800",
      ],
      templateSelectionIndex: null,
      imgFlipMemes: [],
      response: [],
    };
  },
  methods: {
    selectMemeTemplate(selectedIndex) {
      this.templateSelectionIndex = selectedIndex;
      console.log("selectedNewMeme:" + this.templateSelectionIndex);
      this.$emit("messageFromChild", this.images[this.templateSelectionIndex]);
    },

    fetchMemeTemplates() {
      console.log("Fetching memes...");

      axios.get("https://api.imgflip.com/get_memes").then((resp) => {
        console.log(resp.data);

        console.log(resp.data.success);
        if (resp.data.success == true) {
          console.log("Success!");
          this.imgFlipMemes = resp.data.data.memes;
        } else {
          console.log("Failed!");
        }
      });
    },
  },
  mounted() {
    this.fetchMemeTemplates();
  },
};
</script>

<style scoped>
</style>