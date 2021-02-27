<template>
  <b-container fluid>
    <b-row class="mb-3">
      <b-col cols="1.5">
        <b-form-select
          class="border border-primary"
          name="sortBy"
          id="select"
          @change="resetImages(true)"
          v-model="sortBy"
        >
          <b-form-select-option value="null"
            >select an option to sort images</b-form-select-option
          >
          <b-form-select-option value="dateAscending"
            >Creation date (ascending)</b-form-select-option
          >
          <b-form-select-option value="dateDescending"
            >Creation date (descending)</b-form-select-option
          >
          <b-form-select-option value="upvoteAscending"
            >Upvotes (ascending)</b-form-select-option
          >
          <b-form-select-option value="upvoteDescending"
            >Upvotes (descending)</b-form-select-option
          >
          <b-form-select-option value="downvoteAscending"
            >Downvotes (ascending)</b-form-select-option
          >
          <b-form-select-option value="downvoteDescending"
            >Downvotes (descending)</b-form-select-option
          >
          <b-form-select-option value="onlyImages"
            >Only Images</b-form-select-option
          >
          <b-form-select-option value="onlyVideos"
            >Only Videos</b-form-select-option
          >
          <b-form-select-option value="onlyGifs"
            >Only gifs</b-form-select-option
          >
        </b-form-select>
      </b-col>
      <b-col cols="1" v-if="isFilteredImages">
        <b-button
          type="button"
          variant="link"
          @click="removeFilter"
          v-b-tooltip.hover.right="'Click here to remove filter'"
        >
          <b-icon icon="x-square" scale="1.5" variant="danger"></b-icon
        ></b-button>
      </b-col>
      <b-col>
        <b-form-group
          label="Search:"
          label-for="search-meme"
          label-cols-sm="6"
          label-align-sm="right"
        >
          <b-form-input
            id="search-meme"
            v-model="searchQuery"
            placeholder="search meme.."
            @change="resetImages(false)"
            :disabled="isLoading"
          ></b-form-input>
        </b-form-group>
      </b-col>
      <b-col>
        <b-button
          class="float-sm-right"
          size="sm"
          variant="outline-primary"
          v-on:click="showRandomMeme"
          >I'm feeling lucky!</b-button
        >
      </b-col>
    </b-row>

    <b-row
      cols-sm="4"
      class="mb-4"
      align-h="center"
      v-for="image in displayedImages"
      v-bind:key="image._id"
    >
      <b-col sm="12" md="10" lg="8">
        <b-row class="text-large justify-content-md-center">
          {{ image.title }}
          {{ showUserMemesOnly ? "(" + image.visibility + ")" : "" }}
        </b-row>
        <b-row align-h="center">
          <meme
            class="imageContainer"
            :meme="image"
            @openMemeView="openMemeView"
          />
        </b-row>
        <b-row align-h="center" v-if="image.memeStats">
          <b-icon icon="eye" class="m-1" />
          {{ image.memeStats.viewed.length }}
        </b-row>
        <meme-button-bar :image="image" />
        <hr class="w-50" />
      </b-col>
    </b-row>
    <infinite-loading
      :identifier="infiniteId"
      @infinite="loadMoreImages"
    ></infinite-loading>
  </b-container>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";

import router from "../../router/index.js";
import {
  getMemes,
  getUserMemes,
  getRandomMeme,
  updateMultipleTemplatesViewedAfterCreationStats,
  updateMultipleMemesViewedStats,
} from "../../api";
import Meme from "./Meme";
import MemeButtonBar from "./MemeButtonBar";

export default {
  name: "OverviewPage",
  components: {
    InfiniteLoading,
    Meme,
    MemeButtonBar,
  },
  data() {
    return {
      allImages: [],
      displayedImages: [],
      sliceEnd: 2,
      sortBy: null,
      isFilteredImages: false,
      infiniteId: +new Date(),
      searchQuery: null,
      isLoading: false,
      showUserMemesOnly: false,
    };
  },
  methods: {
    openMemeView(imageId) {
      router
        .push({ name: "MemePage", params: { id: imageId } })
        .catch((err) => {
          err;
        });
    },
    async updateDisplayedImages(images) {
      let imagesWithStats = [];
      if (images && images.length) {
        let templateStatsResult = await updateMultipleTemplatesViewedAfterCreationStats(
          images
        );
        let imageStatsResult = await updateMultipleMemesViewedStats(images);
        imagesWithStats = images.map((image, index) => {
          return Object.assign(image, {
            templateStats: templateStatsResult.body[index],
            memeStats: imageStatsResult.body[index],
          });
        });
        this.displayedImages = [...this.displayedImages, ...imagesWithStats];
      }
    },
    async getImages() {
      this.displayedImages = [];
      let result = null;
      if (this.showUserMemesOnly) {
        result = await getUserMemes();
      } else {
        result = await getMemes();
      }
      this.allImages = result.body;

      //sort images by creation date
      const images = this.allImages
        .sort(function (a, b) {
          return new Date(b.creationDate) - new Date(a.creationDate);
        })
        .slice(0, this.sliceEnd);
      //display first two images and wait for scroll to show more
      await this.updateDisplayedImages(images);
      return this.allImages.length > 0;
    },
    async loadMoreImages($state) {
      if (this.$route.name === "MyPage") {
        this.showUserMemesOnly = true;
      }
      this.isLoading = true;
      let dbImagesAvailable = true;
      if (!this.allImages.length) {
        dbImagesAvailable = await this.getImages();
      }
      this.sliceEnd = this.displayedImages.length + 2;
      let allImagesSorted = this.sortImages();
      allImagesSorted = this.searchResult(allImagesSorted);
      let imagesToAdd = allImagesSorted.slice(
        this.displayedImages.length,
        this.sliceEnd
      );
      if (!dbImagesAvailable || !imagesToAdd.length) {
        this.isLoading = false;
        $state.complete();
        return; //No more images to show
      }
      setTimeout(async () => {
        await this.updateDisplayedImages(imagesToAdd);
        this.isLoading = false;
        $state.loaded();
      }, 1000);
    },
    resetImages(isFiltering) {
      this.infiniteId += 1;
      this.displayedImages = [];
      this.isFilteredImages = isFiltering;
    },
    sortImages() {
      let allImagesSorted = this.allImages.sort((a, b) => {
        if (this.sortBy == "dateAscending") {
          return new Date(a.creationDate) - new Date(b.creationDate);
        } else if (this.sortBy == "dateDescending") {
          return new Date(b.creationDate) - new Date(a.creationDate);
        } else if (this.sortBy == "upvoteAscending") {
          return a.upvoteCount - b.upvoteCount;
        } else if (this.sortBy == "upvoteDescending") {
          return b.upvoteCount - a.upvoteCount;
        } else if (this.sortBy == "downvoteAscending") {
          return a.downvoteCount - b.downvoteCount;
        } else if (this.sortBy == "downvoteDescending") {
          return b.downvoteCount - a.downvoteCount;
        }
      });

      // filter images by file format
      if (this.sortBy == "onlyImages") {
        allImagesSorted = this.allImages
          .filter((img) => img.fileType == ".png")
          .slice(0, this.sliceEnd);
      }
      if (this.sortBy == "onlyGifs") {
        allImagesSorted = this.allImages
          .filter((img) => img.fileType == ".gif")
          .slice(0, this.sliceEnd);
      }

      if (this.sortBy == "onlyVideos") {
        allImagesSorted = this.allImages
          .filter((img) => img.fileType == ".webm")
          .slice(0, this.sliceEnd);
      }
      return allImagesSorted;
    },
    removeFilter() {
      this.getImages();
      this.isFilteredImages = false;
      this.sortBy = null;
    },
    searchResult(allImagesSorted) {
      if (this.searchQuery) {
        allImagesSorted = allImagesSorted.filter((image) => {
          return image.title
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        });
      }
      return allImagesSorted;
    },
    async showRandomMeme() {
      let result = await getRandomMeme();
      this.openMemeView(result.body._id);
    },
  },
};
</script>

<style scoped>
.text-large {
  font-size: 180%;
}
</style>