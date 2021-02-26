<template>
  <b-container fluid>
    <b-row class="mb-3">
      <b-col cols="1.5">
        <b-form-select
          class="border border-primary"
          name="sortBy"
          id="select"
          @change="resetImages"
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
        <b-button
          class="float-sm-right"
          size="sm"
          variant="outline-primary"
          v-on:click="show_random_meme"
          >I'm feeling lucky!</b-button
        >
      </b-col>
    </b-row>

    <b-row
      cols-sm="4"
      class="mb-4"
      v-for="(image, index) in displayedImages"
      v-bind:key="image._id"
    >
      <b-col />
      <b-col sm="6">
        <div>
          <b-row class="text-large justify-content-md-center">
            {{ image.title }}
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
          <b-row align-h="center">
            <b-col>
              <b-button
                :disabled="!$store.getters.isLoggedIn"
                variant="outline-success"
                class="ml-3"
                @click="submitUpvote(image._id, index)"
                :title="
                  !$store.getters.isLoggedIn && 'Please login to like image'
                "
              >
                <b-icon icon="hand-thumbs-up" aria-hidden="true"></b-icon>
                {{ image.upvoteCount }}</b-button
              >
              <b-button
                :disabled="!$store.getters.isLoggedIn"
                variant="outline-danger"
                class="ml-3"
                @click="submitDownvote(image._id, index)"
                :title="
                  !$store.getters.isLoggedIn && 'Please login to dislike image'
                "
              >
                <b-icon icon="hand-thumbs-down" aria-hidden="true"></b-icon>
                {{ image.downvoteCount }}</b-button
              >
              <b-button
                variant="outline-primary"
                class="ml-3"
                @click="openMemeView(image._id)"
              >
                <b-icon icon="chat-left" aria-hidden="true"></b-icon>
                {{ image.commentCount }}</b-button
              >
              <!-- @click="openMemeView(image._id)" -->

              <twitter
                :url="frontendURL(image)"
                title="Hello from PENG MEMES"
                scale="3"
                class="ml-3"
                style="cursor: pointer"
              ></twitter>

              <linkedin
                :url="frontendURL(image)"
                title="Hello from PENG MEMES"
                scale="3"
                class="ml-3"
                style="cursor: pointer"
              >
              </linkedin>

              <whats-app
                :url="frontendURL(image)"
                title="Hello from PENG MEMES"
                scale="3"
                class="ml-3"
                style="cursor: pointer"
              ></whats-app>

              <pinterest
                :url="frontendURL(image)"
                scale="3"
                class="ml-3"
                style="cursor: pointer"
              ></pinterest>

              <email
                :url="frontendURL(image)"
                subject="Hello from PENG MEMES"
                scale="3"
                class="ml-3"
                style="cursor: pointer"
              ></email>
            </b-col>
          </b-row>
        </div>
      </b-col>
      <b-col />
      <hr class="w-50" />
    </b-row>
    <infinite-loading
      :identifier="infiniteId"
      @infinite="loadMoreImages"
    ></infinite-loading>
  </b-container>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import {
  Twitter,
  Linkedin,
  Pinterest,
  WhatsApp,
  Email,
} from "vue-socialmedia-share";

import router from "../../router/index.js";
import { getFrontendMemeURL } from "../../helper";
import {
  getMemes,
  postUpvote,
  postDownvote,
  getUpvotes,
  getDownvotes,
  getRandomMeme,
  updateMultipleTemplatesViewedAfterCreationStats,
  updateMultipleMemesViewedStats,
} from "../../api";
import Meme from "./Meme";

export default {
  name: "OverviewPage",
  components: {
    InfiniteLoading,
    Twitter,
    Linkedin,
    Pinterest,
    WhatsApp,
    Email,
    Meme,
  },
  data() {
    return {
      allImages: [],
      displayedImages: [],
      sliceEnd: 2,
      bottom: false,
      sortBy: null,
      isFilteredImages: false,
      infiniteId: +new Date(),
    };
  },
  methods: {
    frontendURL(image) {
      return getFrontendMemeURL(image);
    },
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
      let result = await getMemes();
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
      let dbImagesAvailable = true;
      if (!this.allImages.length) {
        dbImagesAvailable = await this.getImages();
      }
      this.sliceEnd = this.displayedImages.length + 2;
      let allImagesSorted = this.sortImages();
      let imagesToAdd = allImagesSorted.slice(
        this.displayedImages.length,
        this.sliceEnd
      );
      if (!dbImagesAvailable || !imagesToAdd.length) {
        $state.complete();
        return; //No more images to show
      }
      setTimeout(async () => {
        await this.updateDisplayedImages(imagesToAdd);
        $state.loaded();
      }, 2000);
    },

    async submitUpvote(currentImageId, index) {
      var upvote = {
        imageId: currentImageId,
      };
      let result = await postUpvote(upvote);
      if (result.status === 200) {
        this.fetchupvotes(currentImageId, index);
        this.fetchdownvotes(currentImageId, index);
      }
    },
    async submitDownvote(currentImageId, index) {
      var downvote = {
        imageId: currentImageId,
      };
      let result = await postDownvote(downvote);
      if (result.status === 200) {
        // success
        this.fetchdownvotes(currentImageId, index);
        this.fetchupvotes(currentImageId, index);
      }
    },
    async fetchupvotes(currentImageId, index) {
      const params = { imageId: currentImageId };
      let result = await getUpvotes(params);
      var upvotes = result.body.dbUpvotes;
      var upvotesCount = upvotes.length;
      this.displayedImages[index].upvoteCount = upvotesCount;
    },

    async fetchdownvotes(currentImageId, index) {
      const params = { imageId: currentImageId };
      let result = await getDownvotes(params);
      var downvotes = result.body.dbDownvotes;
      var downvotesCount = downvotes.length;
      this.displayedImages[index].downvoteCount = downvotesCount;
    },
    resetImages() {
      this.infiniteId += 1;
      this.displayedImages = [];
      this.isFilteredImages = true;

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
    async show_random_meme() {
      let result = await getRandomMeme();
      this.openMemeView(result.body._id);
    },
  },
};
</script>

<style scoped>
.imageContainer {
  /* max-width: 50%; */
}
.text-large {
  font-size: 180%;
}
</style>