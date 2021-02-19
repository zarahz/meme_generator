<template>
  <b-container fluid>
    <b-row
      cols-sm="4"
      class="mb-4"
      v-for="meme in userMemes"
      v-bind:key="meme._id"
    >
      <b-col />
      <b-col sm="6">
        <div>
          <b-row class="text-large justify-content-md-center">
            {{ meme.title }} ({{ meme.visibility }})
          </b-row>
          <b-row>
            <meme :meme="meme" @openMemeView="openMemeView"></meme>
          </b-row>
          <b-row class="justify-content-md-center">
            <b-button variant="outline-success" class="m-3" disabled>
              <b-icon icon="hand-thumbs-up" aria-hidden="true"></b-icon>
              {{ meme.upvoteCount }}</b-button
            >
            <b-button variant="outline-danger" class="m-3" disabled>
              <b-icon icon="hand-thumbs-down" aria-hidden="true"></b-icon>
              {{ meme.downvoteCount }}</b-button
            >
            <b-button
              variant="outline-primary"
              class="m-3"
              @click="openMemeView(meme._id)"
            >
              <b-icon icon="chat-left" aria-hidden="true"></b-icon>
              {{ meme.commentCount }}</b-button
            >
            <!-- @click="openMemeView(meme._id)" -->
          </b-row>

          <b-row b-row class="mb-3" align-h="center">
            <b-col cols="2" />
            <b-col>
              <facebook :url="getFrontendMemeURL(meme)" scale="3"></facebook>
            </b-col>
            <b-col>
              <twitter
                :url="getFrontendMemeURL(meme)"
                title=""
                scale="3"
              ></twitter>
            </b-col>
            <b-col>
              <linkedin :url="getFrontendMemeURL(meme)" scale="3"></linkedin>
            </b-col>
            <b-col>
              <whats-app
                :url="getFrontendMemeURL(meme)"
                title="Hello"
                scale="3"
              ></whats-app>
            </b-col>

            <b-col>
              <pinterest
                :url="getFrontendMemeURL(meme)"
                scale="3"
                class="m-3"
              ></pinterest>
            </b-col>
            <b-col>
              <email
                :url="getFrontendMemeURL(meme)"
                subject="Hello"
                scale="3"
              ></email>
            </b-col>
            <b-col cols="2" />
          </b-row>
        </div>
      </b-col>
      <b-col />
    </b-row>
    <infinite-loading @infinite="loadMoreImages"></infinite-loading>
  </b-container>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";

import {
  Facebook,
  Twitter,
  Linkedin,
  Pinterest,
  WhatsApp,
  Email,
} from "vue-socialmedia-share";

import router from "../../router/index.js";
import Meme from "../Overview/Meme";
import { getFrontendMemeURL } from "../../helper";
import { getUserMemes } from "../../api";

export default {
  name: "MyPage",
  components: {
    InfiniteLoading,
    Facebook,
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
    async getMemes() {
      let result = await getUserMemes();
      this.allUserMemes = result.memes;

      //sort images by creation date
      this.allUserMemes.sort(function (a, b) {
        return new Date(b.creationDate) - new Date(a.creationDate);
      });
      //display first two images and wait for scroll to show more
      this.userMemes = this.allUserMemes.slice(0, this.sliceEnd);
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
      setTimeout(() => {
        this.userMemes.push(...imagesToAdd);
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