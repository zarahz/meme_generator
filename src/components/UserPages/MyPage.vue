<!-- Overview page for endless scroll -> calls meme.vue with header and src information to display memes -->
<template>
  <b-container class="justify-content-md-center" fluid>
    <b-row
      cols-sm="4"
      class="mb-4"
      v-for="meme in userMemes"
      v-bind:key="meme._id"
    >
      <b-col />
      <b-col sm="6" align-self="center">
        <div>
          <b-row align-h="center">
            {{ meme.title }} ({{ meme.visibility }})
          </b-row>
          <b-row>
            <img
              class="imageContainer"
              :src="'http://localhost:3000/static/' + meme.nameAndFileType"
              @click="openMemeView(meme._id)"
            />
          </b-row>
          <b-row class="justify-content-md-center" cols="4">
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
              <facebook
                :url="'http://localhost:3000/static/' + meme.nameAndFileType"
                scale="3"
              ></facebook>
            </b-col>
            <b-col>
              <twitter
                :url="'http://localhost:3000/static/' + meme.nameAndFileType"
                title=""
                scale="3"
              ></twitter>
            </b-col>
            <b-col>
              <linkedin
                :url="'http://localhost:3000/static/' + meme.nameAndFileType"
                scale="3"
              ></linkedin>
            </b-col>
            <b-col>
              <whats-app
                :url="'http://localhost:3000/static/' + meme.nameAndFileType"
                title="Hello"
                scale="3"
              ></whats-app>
            </b-col>

            <b-col>
              <pinterest
                :url="'http://localhost:3000/static/' + meme.nameAndFileType"
                scale="3"
                class="m-3"
              ></pinterest>
            </b-col>
            <b-col>
              <email
                :url="'http://localhost:3000/static/' + meme.nameAndFileType"
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
    openMemeView(id) {
      console.log("id of the clicked meme is :" + id);
      router.push({ name: "Meme", params: { id } }).catch((err) => {
        err;
      });
    },
    async getMemes() {
      let result = await fetch("http://localhost:3000/user-memes", {
        method: "GET",
        credentials: "include",
      });
      const dbImages = await result.json();
      this.allUserMemes = dbImages;

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
        console.log("loading more images!");
        console.log(imagesToAdd);
        this.userMemes.push(...imagesToAdd);
        $state.loaded();
      }, 2000);
    },
  },
};
</script>

<style scoped>
.imageContainer {
  width: -webkit-fill-available;
}
</style>