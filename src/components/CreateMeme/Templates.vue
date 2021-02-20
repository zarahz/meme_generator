<template>
  <b-container class="justify-content-md-center" fluid>
    <h3>Available Templates</h3>
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
    <b-row align-h="center" class="mb-1">
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
    </b-row>

    <b-row>
      <b-col sm="12" md="12">
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
        <b-row align-h="center">
          <div v-for="(image, i) in displayedMemes" :key="image.url">
            <b-img
              :id="image.url"
              crossorigin="anonymous"
              class="image m-1"
              :src="image.url"
              @click="selectMemeTemplate(i)"
            ></b-img>
            <b-popover :target="image.url" triggers="hover" placement="top">
              <stats
                :viewed="image.stats.viewed"
                :chosen.sync="image.stats.chosen"
                :generated.sync="image.stats.generated"
                :viewedAfterCreation.sync="image.stats.viewedAfterCreation"
                :upvoted.sync="image.stats.upvoted"
                :downvoted.sync="image.stats.downvoted"
              />
            </b-popover>
          </div>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";
import {
  getServerMemes,
  updateMultipleTemplatesViewedStats,
  updateTemplateChosenStats,
} from "../../api";

import Stats from "../Stats/Stats";

const MAX_DISPLAYED_TEMPLATES = 10;

export default {
  name: "Templates",
  props: {
    searchString: String,
  },
  components: {
    Stats,
  },
  data() {
    return {
      templatesSearchTerm: "",
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
    async updateDisplayedMemes(templates) {
      if (templates.length) {
        let result = await updateMultipleTemplatesViewedStats(templates);
        if (result.body.length) {
          templates = templates.map((template, index) => {
            return Object.assign(template, { stats: result.body[index] });
          });
        }
      }
      this.displayedMemes = templates;
    },
    applySearchToServerTemplates() {
      var searchTerm = this.templatesSearchTerm;
      if (searchTerm.length < 1) {
        // NO search term
        // inefficient and biased array shuffle
        let shuffled = this.allServerMemes
          .map((a) => ({ sort: Math.random(), value: a }))
          .sort((a, b) => a.sort - b.sort)
          .map((a) => a.value);
        this.updateDisplayedMemes(shuffled.slice(0, MAX_DISPLAYED_TEMPLATES));
      } else {
        // WITH search term
        let searchResult = this.allServerMemes.filter((template) => {
          template.tags.toLowerCase().includes(searchTerm.toLowerCase());
        });
        this.updateDisplayedMemes(
          searchResult.slice(0, MAX_DISPLAYED_TEMPLATES)
        );
      }
    },
    applySearchToImgflipTemplates() {
      var searchTerm = this.templatesSearchTerm;
      let templates = [];
      if (searchTerm.length < 1) {
        // NO search term
        // inefficient and biased array shuffle
        templates = this.allImgflipMemes
          .map((a) => ({ sort: Math.random(), value: a }))
          .sort((a, b) => a.sort - b.sort)
          .map((a) => a.value)
          .slice(0, MAX_DISPLAYED_TEMPLATES);
      } else {
        // WITH search term
        templates = this.allImgflipMemes
          .filter((template) => {
            template.name.toLowerCase().includes(searchTerm.toLowerCase());
          })
          .slice(0, MAX_DISPLAYED_TEMPLATES);
      }
      this.updateDisplayedMemes(templates);
    },
    async selectMemeTemplate(selectedIndex) {
      if (selectedIndex == -1) {
        selectedIndex = this.displayedMemes.length - 1;
      } else if (selectedIndex == this.displayedMemes.length) {
        selectedIndex = 0;
      }
      this.selectedIndex = selectedIndex;
      const selectedTemplate = this.displayedMemes[selectedIndex];
      let result = await updateTemplateChosenStats(selectedTemplate);
      selectedTemplate.stats = result.body;
      //update displaymemes here to dynamically change the stats!
      this.$set(this.displayedMemes, selectedIndex, selectedTemplate);
      this.$emit(
        "newTemplateSelected",
        selectedTemplate.url,
        selectedTemplate.name
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
    async fetchServerMemeTemplates() {
      const result = await getServerMemes();
      this.allServerMemes = result.body;
      this.applySearch();
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