<template>
  <b-container class="justify-content-md-center" fluid>
    <h3>Available templates</h3>
    <b-row align-h="center">
      <b-form-checkbox
        v-model="showImgflipTemplates"
        name="templateSwitch"
        switch
        @change="switchTemplates"
      >
        {{ templateSourceText }}
      </b-form-checkbox>
    </b-row>
    <b-button
      pill
      type="button"
      class="btn btn-default btn-sm"
      variant="outline-primary"
      v-on:click="selectMemeTemplate(--selectedIndex)"
    >
      previous
    </b-button>
    <b-button
      pill
      type="button"
      class="btn btn-default btn-sm"
      variant="outline-primary"
      v-on:click="selectMemeTemplate(++selectedIndex)"
    >
      next
    </b-button>

    <b-row align-h="center">
      <b-col cols="12" md="auto">
        <b-row align-h="center">
          <b-nav-form>
            <b-form-input
              v-on:input="applySearch"
              v-model="templatesSearchTerm"
              size="sm"
              class="mr-sm-2"
              placeholder="search templates"
            ></b-form-input>
          </b-nav-form>
        </b-row>
        <img
          crossorigin="anonymous"
          class="image m-1"
          v-for="(image, i) in displayedMemes"
          :src="displayedMemes[i].url"
          :key="i"
          @click="selectMemeTemplate(i)"
        />

        <vue-gallery-slideshow :images="[]" :index="null" @close="index = null">
        </vue-gallery-slideshow>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";
import VueGallerySlideshow from "vue-gallery-slideshow";

const MAX_DISPLAYED_TEMPLATES = 10;

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
      displayedMemes: [],
      allImgflipMemes: [],
      allServerMemes: [],
      response: [],
      showImgflipTemplates: false, // server if false, imgflip if true
      templateSourceText: "Server",
      selectedIndex: 0,
    };
  },
  methods: {
    // TODO decide on one naming convention!

    applySearch() {
      if (this.showImgflipTemplates) {
        this.applySearchToImgflipTemplates();
      } else {
        this.applySearchToServerTemplates();
      }
    },
    applySearchToServerTemplates() {
      this.displayedMemes = [];
      var displayedMemes = this.displayedMemes;
      var searchTerm = this.templatesSearchTerm;
      if (searchTerm.length < 1) {
        // NO search term
        this.allServerMemes.forEach(function (item) {
          displayedMemes.push(item);
        });
        // inefficient and biased array shuffle
        let shuffled = displayedMemes
          .map((a) => ({ sort: Math.random(), value: a }))
          .sort((a, b) => a.sort - b.sort)
          .map((a) => a.value);

        this.displayedMemes = shuffled.slice(0, MAX_DISPLAYED_TEMPLATES);
      } else {
        // WITH search term
        this.allServerMemes.forEach(function (item) {
          if (item.tags.toLowerCase().includes(searchTerm.toLowerCase())) {
            displayedMemes.push(item);
          }
        });
        this.displayedMemes = displayedMemes.slice(0, MAX_DISPLAYED_TEMPLATES);
      }
    },
    applySearchToImgflipTemplates() {
      this.displayedMemes = [];
      var displayedMemes = this.displayedMemes;
      var searchTerm = this.templatesSearchTerm;
      if (searchTerm.length < 1) {
        // NO search term
        this.allImgflipMemes.forEach(function (item) {
          displayedMemes.push(item);
        });
        // inefficient and biased array shuffle
        let shuffled = displayedMemes
          .map((a) => ({ sort: Math.random(), value: a }))
          .sort((a, b) => a.sort - b.sort)
          .map((a) => a.value);

        this.displayedMemes = shuffled.slice(0, MAX_DISPLAYED_TEMPLATES);
      } else {
        // WITH search term
        this.allImgflipMemes.forEach(function (item) {
          if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            displayedMemes.push(item);
          }
        });
        this.displayedMemes = displayedMemes.slice(0, MAX_DISPLAYED_TEMPLATES);
      }
    },
    selectMemeTemplate(selectedIndex) {
      if(selectedIndex == -1){
        selectedIndex = this.displayedMemes.length - 1;
      } else if (selectedIndex == this.displayedMemes.length) {
        selectedIndex = 0;
      }
      this.templateSelectionIndex = selectedIndex;
      this.$emit(
        "newTemplateSelected",
        this.displayedMemes[this.templateSelectionIndex].url,
        this.displayedMemes[this.templateSelectionIndex].name
      );
   
    },

    fetchImgflipMemeTemplates() {
      axios.get("https://api.imgflip.com/get_memes").then((resp) => {
        if (resp.data.success == true) {
          this.allImgflipMemes = resp.data.data.memes;
        } else {
          console.log("Failed to get meme templates from imgflip :(");
        }
        this.applySearch();
      });
    },
    fetchServerMemeTemplates() {
      axios.get("http://localhost:3000/templates").then((resp) => {
        this.allServerMemes = resp.data;
        this.applySearch();
      });
    },
    switchTemplates() {
      if (this.showImgflipTemplates) {
        this.templateSourceText = "imgflip";
      } else {
        this.templateSourceText = "Server";
      }
      this.applySearch();
    },
  },
  mounted() {
    this.fetchServerMemeTemplates();
    this.fetchImgflipMemeTemplates();
  },
};
</script>

<style scoped>
.image {
  vertical-align: top;
  max-width: 200px;
}
</style>