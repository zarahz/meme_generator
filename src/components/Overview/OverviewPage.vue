<!-- Overview page for endless scroll -> calls meme.vue with header and src information to display memes -->
<template>
  <b-container class="justify-content-md-center" fluid>
    <b-row
      cols-sm="4"
      class="mb-4"
      v-for="image in displayedImages"
      v-bind:key="image._id"
    >
      <b-col />
      <b-col sm="6" align-self="center">
        <div>
          <b-row>
            <img
              class="imageContainer"
              :src="'http://localhost:3000/static/' + image.nameAndFileType"
              @click="openMemeView(image._id)"
            />
          </b-row>
          <b-row class="justify-content-md-center" cols="4">
            <b-button
              variant="outline-success"
              class="m-3"
              @click="submitUpvote(image._id)"
            >
              <b-icon icon="hand-thumbs-up" aria-hidden="true"></b-icon>
              {{ upvotesCount }}</b-button
            >
            <b-button
              variant="outline-danger"
              class="m-3"
              @click="submitDownvote(image._id)"
            >
              <b-icon icon="hand-thumbs-down" aria-hidden="true"></b-icon>
              {{ downvotesCount }}</b-button
            >
            <b-button
              variant="outline-primary"
              class="m-3"
              @click="openMemeView(image._id)"
            >
              <b-icon icon="chat-left" aria-hidden="true"></b-icon>
              {{ image.commentCount }}</b-button
            >
            <!-- @click="openMemeView(image._id)" -->
          </b-row>

          <b-row b-row class="mb-3" align-h="center">
            <b-col cols="2" />
            <b-col>
              <facebook
                :url="'http://localhost:3000/static/' + image.nameAndFileType"
                scale="3"
              ></facebook>
            </b-col>
            <b-col>
              <twitter
                :url="'http://localhost:3000/static/' + image.nameAndFileType"
                title=""
                scale="3"
              ></twitter>
            </b-col>
            <b-col>
              <linkedin
                :url="'http://localhost:3000/static/' + image.nameAndFileType"
                scale="3"
              ></linkedin>
            </b-col>
            <b-col>
              <whats-app
                :url="'http://localhost:3000/static/' + image.nameAndFileType"
                title="Hello"
                scale="3"
              ></whats-app>
            </b-col>

            <b-col>
              <pinterest
                :url="'http://localhost:3000/static/' + image.nameAndFileType"
                scale="3"
                class="m-3"
              ></pinterest>
            </b-col>
            <b-col>
              <email
                :url="'http://localhost:3000/static/' + image.nameAndFileType"
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
  name: "OverviewPage",
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
      allImages: [],
      displayedImages: [],
      upvotesCount: 0,
      upvotes: [],
      downvotesCount: 0,
      downvotes: [],
      sliceEnd: 2,
      bottom: false,
    };
  },
  methods: {
    openMemeView(imageId) {
      console.log("id of the clicked image is :" + imageId);
      router.push({ name: "Meme", params: { id: imageId } }).catch((err) => {
        err;
      });
    },
    async getImages() {
      let result = await fetch("http://localhost:3000/memes", {
        method: "GET",
      });
      const dbImages = await result.json();
      this.allImages = dbImages;
      //sort images by creation date
      this.allImages.sort(function (a, b) {
        return new Date(b.creationDate) - new Date(a.creationDate);
      });
      //display first two images and wait for scroll to show more
      this.displayedImages = this.allImages.slice(0, this.sliceEnd);
      return this.allImages.length > 0;
    },
    async loadMoreImages($state) {
      let dbImagesAvailable = true;
      if (!this.allImages.length) {
        dbImagesAvailable = await this.getImages();
      }
      this.sliceEnd = this.displayedImages.length + 2;
      const imagesToAdd = this.allImages.slice(
        this.displayedImages.length,
        this.sliceEnd
      );
      if (!dbImagesAvailable || !imagesToAdd.length) {
        $state.complete();
        return; //No more images to show
      }
      setTimeout(() => {
        console.log("loading more images!");
        console.log(imagesToAdd);
        this.displayedImages.push(...imagesToAdd);
        $state.loaded();
      }, 2000);
    },
    async fetchCommentCount(currentImageId) {
      var commentUrl = new URL("http://localhost:3000/comments"),
        params = { imageId: currentImageId };
      Object.keys(params).forEach((key) =>
        commentUrl.searchParams.append(key, params[key])
      );
      let result = await fetch(commentUrl);

      const { dbComments } = await result.json();
      this.comments = dbComments;
      this.commentsCount = this.comments.length;
    },
    async submitUpvote(currentImageId) {
      var imageId = currentImageId;
      console.log(imageId);
      console.log("image liked");
      var upvoteUrl = "http://localhost:3000/post-upvote";
      var upvote = {
        imageId: currentImageId,
        authorId: this.$store.getters.user._id,
      };
      let result = await fetch(upvoteUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(upvote),
      });
      if (result.status !== 200) {
        const { error } = await result.json();
        console.log(error);
      } else {
        // success
        this.fetchupvotes(imageId);
      }
    },
    async submitDownvote(currentImageId) {
      var imageId = currentImageId;
      console.log(imageId);
      console.log("image disliked");
      var downvoteUrl = "http://localhost:3000/post-downvote";
      var downvote = {
        imageId: currentImageId,
        authorId: this.$store.getters.user._id,
      };
      let result = await fetch(downvoteUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(downvote),
      });
      if (result.status !== 200) {
        const { error } = await result.json();
        console.log(error);
      } else {
        // success
        this.fetchdownvotes(imageId);
      }
    },
    async fetchupvotes(currentImageId) {
      var ImageId = currentImageId;
      var upvoteUrl = new URL("http://localhost:3000/upvotes"),
        params = { imageId: ImageId };
      Object.keys(params).forEach((key) =>
        upvoteUrl.searchParams.append(key, params[key])
      );
      let result = await fetch(upvoteUrl);
      const { dbUpvotes } = await result.json();
      this.upvotes = dbUpvotes;
      this.upvotesCount = this.upvotes.length;
    },

    async fetchdownvotes(currentImageId) {
      var ImageId = currentImageId;
      var downvoteUrl = new URL("http://localhost:3000/downvotes"),
        params = { imageId: ImageId };
      Object.keys(params).forEach((key) =>
        downvoteUrl.searchParams.append(key, params[key])
      );
      let result = await fetch(downvoteUrl);
      const { dbDownvotes } = await result.json();
      this.downvotes = dbDownvotes;
      this.downvotesCount = this.downvotes.length;
    },
  },
};
</script>

<style scoped>
.imageContainer {
  width: -webkit-fill-available;
}
</style>