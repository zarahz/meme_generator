<template>
  <b-container fluid>
    <b-row class="mb-3">
      <b-col cols="1.5">
        <b-form-select
          class="border border-primary"
          name="sortBy"
          id="select"
          @change="sortImages"
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
    </b-row>
    <b-row
      cols-sm="12"
      class="mb-4"
      align-h="center"
      v-for="meme in userMemes"
      v-bind:key="meme._id"
    >
      <b-col sm="6">
        <b-row class="text-large justify-content-md-center">
          {{ meme.title }} ({{ meme.visibility }})
        </b-row>
        <b-row>
          <meme :meme="meme" @openMemeView="openMemeView"></meme>
        </b-row>
        <b-row align-h="center" meme.memeStats>
          <b-icon icon="eye" class="m-1" /> {{ meme.memeStats.viewed.length }}
        </b-row>
        <b-row align-h="center" class="m-3">
          <b-col>
            <b-button variant="outline-success" class="ml-3" disabled>
              <b-icon icon="hand-thumbs-up" aria-hidden="true"></b-icon>
              {{ meme.upvoteCount }}</b-button
            >
            <b-button variant="outline-danger" class="ml-3" disabled>
              <b-icon icon="hand-thumbs-down" aria-hidden="true"></b-icon>
              {{ meme.downvoteCount }}</b-button
            >
            <b-button
              variant="outline-primary"
              class="ml-3"
              @click="openMemeView(meme._id)"
            >
              <b-icon icon="chat-left" aria-hidden="true"></b-icon>
              {{ meme.commentCount }}</b-button
            >

            <twitter
              :url="getFrontendMemeURL(meme)"
              title="Hello from PENG MEMES"
              scale="3"
              class="ml-3"
              style="cursor: pointer"
            ></twitter>

            <linkedin
              :url="getFrontendMemeURL(meme)"
              title="Hello from PENG MEMES"
              scale="3"
              class="ml-3"
              style="cursor: pointer"
            >
            </linkedin>

            <whats-app
              :url="getFrontendMemeURL(meme)"
              title="Hello from PENG MEMES"
              scale="3"
              class="ml-3"
              style="cursor: pointer"
            ></whats-app>

            <pinterest
              :url="getFrontendMemeURL(meme)"
              scale="3"
              class="ml-3"
              style="cursor: pointer"
            ></pinterest>

            <email
              :url="getFrontendMemeURL(meme)"
              subject="Hello from PENG MEMES"
              scale="3"
              class="ml-3"
              style="cursor: pointer"
            ></email>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <infinite-loading @infinite="loadMoreImages"></infinite-loading>
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
import Meme from "../Overview/Meme";
import { getFrontendMemeURL } from "../../helper";
import {
  getUserMemes,
  updateMultipleMemesViewedStats,
  updateMultipleTemplatesViewedAfterCreationStats,
} from "../../api";

export default {
  name: "MyPage",
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
      allUserMemes: [],
      userMemes: [],
      sliceEnd: 2,
      bottom: false,
      sortBy: "null",
      isFilteredImages: false,
    };
  },
  methods: {
    getFrontendMemeURL,
    openMemeView(id) {
      router.push({ name: "MemePage", params: { id } }).catch((err) => {
        err;
      });
    },
    async updateUserMemes(memes) {
      let memesWithStats = [];
      if (memes && memes.length) {
        let templateStatsResult = await updateMultipleTemplatesViewedAfterCreationStats(
          memes
        );
        let memeStatsResult = await updateMultipleMemesViewedStats(memes);
        memesWithStats = memes.map((meme, index) => {
          return Object.assign(meme, {
            templateStats: templateStatsResult.body[index],
            memeStats: memeStatsResult.body[index],
          });
        });
        this.userMemes = [...this.userMemes, ...memesWithStats];
        console.log(this.userMemes);
      }
    },
    async getMemes() {
      let result = await getUserMemes();
      this.allUserMemes = result.body;
      // console.log(this.allUserMemes)
      //sort images by creation date
      const memes = this.allUserMemes
        .sort(function (a, b) {
          return new Date(b.creationDate) - new Date(a.creationDate);
        })
        .slice(0, this.sliceEnd);
      //display first two images and wait for scroll to show more
      await this.updateUserMemes(memes);
      return this.allUserMemes.length > 0;
    },
    async loadMoreImages($state) {
      let dbImagesAvailable = true;
      if (!this.allUserMemes.length) {
        dbImagesAvailable = await this.getMemes();
      }
      this.sliceEnd = this.userMemes.length + 2;
      const imagesToAdd = this.allUserMemes.slice(
        this.userMemes.length,
        this.sliceEnd
      );
      if (!dbImagesAvailable || !imagesToAdd.length) {
        $state.complete();
        return; //No more images to show
      }
      setTimeout(async () => {
        await this.updateUserMemes(imagesToAdd);
        // this.userMemes.push(...imagesToAdd);
        $state.loaded();
      }, 2000);
    },
    sortImages() {
      this.userMemes = [];
      this.infiniteId += 1;
      this.isFilteredImages = true;
      //reset sliceEnd and display images for endless scroll
      // this.sliceEnd = 2;
      let toBeDisplayed = this.allUserMemes.sort((a, b) => {
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
      }); //;
      // .slice(0, this.sliceEnd);

      // filter images by file format
      if (this.sortBy == "onlyImages") {
        toBeDisplayed = this.allUserMemes
          .filter((img) => img.fileType == ".png")
          .slice(0, this.sliceEnd);
      }
      if (this.sortBy == "onlyGifs") {
        toBeDisplayed = this.allUserMemes
          .filter((img) => img.fileType == ".gif")
          .slice(0, this.sliceEnd);
      }

      if (this.sortBy == "onlyVideos") {
        toBeDisplayed = this.allUserMemes
          .filter((img) => img.fileType == ".webm")
          .slice(0, this.sliceEnd);
      }
      this.updateUserMemes(toBeDisplayed);
    },
    removeFilter() {
      // display the memes again without any filter or sort
      this.userMemes = [];
      this.getMemes();
      this.isFilteredImages = false;
      this.sortBy = null;
    },
  },
};
</script>

<style scoped>
.text-large {
  font-size: 180%;
}
</style>