<!-- Overview page for endless scroll -> calls meme.vue with header and src information to display memes -->
<template>
  <b-container fluid>
    <b-row>
      <b-col cols="2.5">
        <b-form-select
          name="sortBy"
          id="select"
          @change="filteredImages"
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
        </b-form-select>
      </b-col>

      <b-button
        size="sm"
        variant="outline-primary"
        class="m-md-2"
        v-on:click="show_random_meme"
        >I'm feeling lucky!</b-button
      >
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
          <b-row class="pull-right text-large">
            {{ image.title }}
          </b-row>
          <b-row align-h="center">
            <img
              class="imageContainer"
              :src="'http://localhost:3000/static/' + image.nameAndFileType"
              @click="openMemeView(image._id)"
            />
          </b-row>
          <b-row align-h="center">
            <b-button
              variant="outline-success"
              class="m-3"
              @click="submitUpvote(image._id, index)"
            >
              <b-icon icon="hand-thumbs-up" aria-hidden="true"></b-icon>
              {{ image.upvoteCount }}</b-button
            >
            <b-button
              variant="outline-danger"
              class="m-3"
              @click="submitDownvote(image._id, index)"
            >
              <b-icon icon="hand-thumbs-down" aria-hidden="true"></b-icon>
              {{ image.downvoteCount }}</b-button
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

          <b-row class="mb-3" align-h="center">
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
      <hr class="w-50" />
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
      sliceEnd: 2,
      bottom: false,
      sortBy: "null",
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

    async submitUpvote(currentImageId, index) {
      var imageId = currentImageId;
      var upvoteUrl = "http://localhost:3000/post-upvote";
      var upvote = {
        imageId: currentImageId,
      };
      let result = await fetch(upvoteUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(upvote),
      });
      if (result.status !== 200) {
        const { error } = await result.json();
        console.log(error);
      } else {
        // success
        this.fetchupvotes(imageId, index);
      }
    },
    async submitDownvote(currentImageId, index) {
      var imageId = currentImageId;
      var downvoteUrl = "http://localhost:3000/post-downvote";
      var downvote = {
        imageId: currentImageId,
      };
      let result = await fetch(downvoteUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(downvote),
      });
      if (result.status !== 200) {
        const { error } = await result.json();
        console.log(error);
      } else {
        // success
        this.fetchdownvotes(imageId, index);
      }
    },
    async fetchupvotes(currentImageId, index) {
      var ImageId = currentImageId;
      var upvoteUrl = new URL("http://localhost:3000/upvotes"),
        params = { imageId: ImageId };
      Object.keys(params).forEach((key) =>
        upvoteUrl.searchParams.append(key, params[key])
      );
      let result = await fetch(upvoteUrl);
      const { dbUpvotes } = await result.json();
      var upvotes = dbUpvotes;
      var upvotesCount = upvotes.length;
      this.displayedImages[index].upvoteCount = upvotesCount;
    },

    async fetchdownvotes(currentImageId, index) {
      var ImageId = currentImageId;
      var downvoteUrl = new URL("http://localhost:3000/downvotes"),
        params = { imageId: ImageId };
      Object.keys(params).forEach((key) =>
        downvoteUrl.searchParams.append(key, params[key])
      );
      let result = await fetch(downvoteUrl);
      const { dbDownvotes } = await result.json();
      var downvotes = dbDownvotes;
      var downvotesCount = downvotes.length;
      this.displayedImages[index].downvoteCount = downvotesCount;
    },
    
    filteredImages() {
      this.displayedImages = this.allImages;
      this.displayedImages.sort((a, b) => {
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

      return this.displayedImage;
    },

    async show_random_meme() {
      var random_meme_url = "http://localhost:3000/random-meme";
      let result = await fetch(random_meme_url);
      const image = await result.json();
      var meme = image;
      console.log(meme.title + " ### " + meme._id);
      this.openMemeView(meme._id);
    },
  },
};
</script>

<style scoped>
.imageContainer {
  width: -webkit-fill-available;
  max-width: 50%;
}
.text-large {
  font-size: 180%;
}
</style>