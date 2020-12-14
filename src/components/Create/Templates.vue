<template>
  <b-container class="justify-content-md-center" fluid>
    <h2>Pick a template!</h2>

    <b-row align-h="center">
      <b-col cols="3">
        <b-nav-form>
          <b-form-input
            v-on:input="refresh_templates_search"
            v-model="templatesSearchTerm"
            size="sm"
            class="mr-sm-2"
            placeholder="search templates"
          ></b-form-input>
        </b-nav-form>
        <img
          style="width: 50%"
          class="image"
          v-for="(image, i) in displayedImgFlipMemes"
          :src="displayedImgFlipMemes[i].url"
          :key="i"
          @click="selectMemeTemplate(i)"
        />
        <vue-gallery-slideshow :images="[]" :index="null" @close="index = null">
        </vue-gallery-slideshow>
      </b-col>
    </b-row>
    <b-row align-h="center">Templates </b-row>
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
      templatesSearchTerm: "",
      templateSelectionIndex: null,
      displayedImgFlipMemes: [],
      allImgFlipMemes: [],
      response: [],
    };
  },
  methods: {
    refresh_templates_search() {
      this.displayedImgFlipMemes = [];
      var displayedImgFlipMemes = this.displayedImgFlipMemes;
      var searchTerm = this.templatesSearchTerm;
      if (searchTerm.length < 1) {
        // NO search term
        this.allImgFlipMemes.forEach(function (item) {
          displayedImgFlipMemes.push(item);
        });
        // inefficient and biased array shuffle
        let shuffled = displayedImgFlipMemes
          .map((a) => ({ sort: Math.random(), value: a }))
          .sort((a, b) => a.sort - b.sort)
          .map((a) => a.value);

        this.displayedImgFlipMemes = shuffled.slice(1, 11);
      } else {
        // WITH search term
        this.allImgFlipMemes.forEach(function (item) {
          if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            displayedImgFlipMemes.push(item);
          }
        });
        this.displayedImgFlipMemes = displayedImgFlipMemes.slice(1, 11);
      }
    },
    selectMemeTemplate(selectedIndex) {
      this.templateSelectionIndex = selectedIndex;
      this.$emit(
        "newTemplateSelected",
        this.displayedImgFlipMemes[this.templateSelectionIndex].url
      );
    },

    fetchMemeTemplates() {
      console.log("Fetching memes...");
      axios.get("https://api.imgflip.com/get_memes").then((resp) => {
        console.log(resp.data);

        console.log(resp.data.success);
        if (resp.data.success == true) {
          this.allImgFlipMemes = resp.data.data.memes;
          this.refresh_templates_search();
        } else {
          console.log("Failed to get meme templates from imgFlip :(");
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