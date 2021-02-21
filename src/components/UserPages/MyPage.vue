<template>
  <b-container fluid>
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
          <b-icon icon="eye" class="m-1" /> {{ meme.memeStats.viewed }}
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
      }
    },
    async getMemes() {
      let result = await getUserMemes();
      this.allUserMemes = result.body;

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
  },
};
</script>

<style scoped>
.text-large {
  font-size: 180%;
}
</style>