<template>
  <b-container class="justify-content-md-center">
    <div v-if="authorized && image.fileType">
      <b-row align-h="center" class="pull-right text-large">
        {{ image.title }}
      </b-row>
      <b-row align-h="center">
        <b-col cols="1" align-self="center">
          <b-button
            variant="light"
            class="ml-3"
            @click="changeImage(--currentImageIndex)"
          >
            <b-icon icon="chevron-left" aria-hidden="true"></b-icon>
          </b-button>
        </b-col>
        <b-col cols="10">
          <meme :meme="image" :autoplay="true" />
        </b-col>
        <b-col cols="1" align-self="center">
          <b-button
            variant="light"
            class="ml-3"
            @click="changeImage(++currentImageIndex)"
          >
            <b-icon icon="chevron-right" aria-hidden="true"></b-icon>
          </b-button>
        </b-col>
      </b-row>
      <b-row align-h="center" v-if="image.memeStats">
        <b-icon icon="eye" class="m-1" /> {{ image.memeStats.viewed.length }}
      </b-row>
      <b-row align-h="center" class="m-3">
        <b-col>
          <b-button
            :variant="upvoteButtonVariant"
            class="ml-3"
            @click="submitUpvote"
            :disabled="!$store.getters.isLoggedIn"
            :title="!$store.getters.isLoggedIn && 'Please login to like image'"
          >
            <b-icon icon="hand-thumbs-up" aria-hidden="true"></b-icon>
            {{ upvotesCount }}</b-button
          >
          <b-button
            :variant="downvoteButtonVariant"
            class="ml-3"
            @click="submitDownvote"
            :disabled="!$store.getters.isLoggedIn"
            :title="
              !$store.getters.isLoggedIn && 'Please login to dislike image'
            "
          >
            <b-icon icon="hand-thumbs-down" aria-hidden="true"></b-icon>
            {{ downvotesCount }}</b-button
          >
          <b-button variant="outline-primary" class="ml-3">
            <b-icon icon="chat-left" aria-hidden="true"></b-icon>
            {{ commentsCount }}</b-button
          >
          <b-button
            variant="outline-primary"
            class="ml-3"
            :disabled="!['.gif', '.jpeg', '.png'].includes(image.fileType)"
            @click="downloadImage"
          >
            <b-icon icon="download" aria-hidden="true"></b-icon>
          </b-button>

          <twitter
            :url="getFrontendMemeURL(image)"
            title="Hello from PENG MEMES"
            scale="3"
            class="ml-3"
            style="cursor: pointer"
          ></twitter>
          <linkedin
            :url="getFrontendMemeURL(image)"
            scale="3"
            class="ml-3"
            style="cursor: pointer"
          ></linkedin>
          <whats-app
            :url="getFrontendMemeURL(image)"
            title="Hello from PENG MEMES"
            scale="3"
            class="ml-3"
            style="cursor: pointer"
          ></whats-app>
          <pinterest
            :url="getFrontendMemeURL(image)"
            scale="3"
            class="ml-3"
            style="cursor: pointer"
          ></pinterest>
          <email
            :url="getFrontendMemeURL(image)"
            subject="Hello from PENG MEMES"
            scale="3"
            class="ml-3"
            style="cursor: pointer"
          ></email>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-form-input
          v-on:keyup.enter="submitComment"
          v-model="commentInput"
          class="w-50 m-3"
          type="text"
          placeholder="Type your comment here..."
        />
      </b-row>
      {{ commentErrorText }}
      <b-row
        class="justify-content-md-center"
        v-for="comment in comments"
        v-bind:key="comment._id"
        style="background-color: #e6e6e6"
      >
        <b-col>
          {{ comment.creationDate }}
          <strong>{{ comment.username }}: </strong>
        </b-col>
        <b-col style="text-align: left">
          {{ comment.content }}
        </b-col>
      </b-row>

      <b-row>
        <!-- STATS! -->
        <meme-statistics
          v-if="image.memeStats"
          :upvoteDates="upvotes.map((upvote) => upvote.creationDate)"
          :downvoteDates="downvotes.map((downvote) => downvote.creationDate)"
          :viewDates="image.memeStats.viewed"
          :viewAfterCreationDates="image.templateStats.viewedAfterCreation"
          :generatedDates="image.templateStats.generated"
        />
      </b-row>
    </div>
    <div v-else>
      Oh Oh, it seems like you are not authorized to see this meme! :(
    </div>
  </b-container>
</template>
<script>
import moment from "moment";
import { saveAs } from "file-saver";
import {
  Twitter,
  Linkedin,
  Pinterest,
  WhatsApp,
  Email,
} from "vue-socialmedia-share";

import {
  postComment,
  postUpvote,
  postDownvote,
  getComments,
  getUpvotes,
  getDownvotes,
  getMemes,
  updateMultipleTemplatesViewedAfterCreationStats,
  updateMultipleMemesViewedStats,
} from "../../api";
import { getBackendMemeURL, getFrontendMemeURL } from "../../helper";
import Meme from "./Meme";
import MemeStatistics from "./MemeStatistics.vue";

export default {
  name: "MemePage",

  components: {
    Twitter,
    Linkedin,
    Pinterest,
    WhatsApp,
    Email,
    Meme,
    MemeStatistics,
  },

  data() {
    return {
      imageId: this.$route.params.id,
      imageURL: "",
      title: "Meme view",
      image: {},
      allImages: [],
      upvotesCount: 0,
      upvotes: [],
      downvotesCount: 0,
      downvotes: [],
      commentsCount: 0,
      comments: [],
      commentInput: "",
      commentErrorText: "",
      authorized: true,
      currentImageIndex: 0,
      imageIsLikedbyCurrentUser: false,
      upvoteButtonVariant: "outline-success",
      imageIsDislikedbyCurrentUser: false,
      downvoteButtonVariant: "outline-danger",
    };
  },
  methods: {
    getFrontendMemeURL,
    async updateStats() {
      let templateStatsResult = await updateMultipleTemplatesViewedAfterCreationStats(
        [this.image]
      );
      let imageStatsResult = await updateMultipleMemesViewedStats([this.image]);
      this.$set(this.image, "memeStats", imageStatsResult.body[0]);
      this.$set(this.image, "templateStats", templateStatsResult.body[0]);
    },
    changeUpvoteVariant() {
      if (this.imageIsLikedbyCurrentUser == true) {
        this.upvoteButtonVariant = "success";
      } else if (this.imageIsLikedbyCurrentUser == false) {
        this.upvoteButtonVariant = "outline-success";
      }
    },

    changeDownvoteVariant() {
      if (this.imageIsDislikedbyCurrentUser == true) {
        this.downvoteButtonVariant = "danger";
      } else if (this.imageIsDislikedbyCurrentUser == false) {
        this.downvoteButtonVariant = "outline-danger";
      }
    },
    async submitComment() {
      if (!this.$store.getters.isLoggedIn) {
        this.commentErrorText = "You need to login to comment.";
        return;
      }
      this.commentErrorText = "Submitting comment...";
      var comment = {
        imageId: this.imageId,
        content: this.commentInput,
      };
      let result = await postComment(comment);
      if (result.status !== 200) {
        this.commentErrorText = "Error submitting comment: " + result.error;
        //this.$set(this.errors, "post-comment", error);
      } else {
        // success
        this.commentInput = "";
        this.commentErrorText = "Comment submitted!";
        this.fetchComments();
      }
    },
    async submitUpvote() {
      var upvote = {
        imageId: this.imageId,
      };
      let result = await postUpvote(upvote);
      if (result.status === 200) {
        this.imageIsLikedbyCurrentUser = !this.imageIsLikedbyCurrentUser;
        this.imageIsDislikedbyCurrentUser = false;
        this.changeDownvoteVariant();
        this.changeUpvoteVariant();
        this.fetchupvotes();
        this.fetchdownvotes();
      }
    },
    async submitDownvote() {
      var downvote = {
        imageId: this.imageId,
      };
      let result = await postDownvote(downvote);
      if (result.status === 200) {
        this.imageIsDislikedbyCurrentUser = !this.imageIsDislikedbyCurrentUser;
        this.imageIsLikedbyCurrentUser = false;
        this.changeDownvoteVariant();
        this.changeUpvoteVariant();
        this.fetchdownvotes();
        this.fetchupvotes();
      }
    },

    async fetchupvotes() {
      const params = { imageId: this.imageId };
      let result = await getUpvotes(params);
      this.upvotes = result.body.dbUpvotes;
      this.upvotesCount = this.upvotes.length;
      for (var upvote in this.upvotes) {
        if (this.$store.getters.user._id === this.upvotes[upvote].authorId) {
          this.imageIsLikedbyCurrentUser = true;
          this.imageIsDislikedbyCurrentUser = false;
          this.changeUpvoteVariant();
          this.changeDownvoteVariant();
        } else {
          this.imageIsLikedbyCurrentUser = false;
          this.changeUpvoteVariant();
        }
      }
    },

    async fetchdownvotes() {
      const params = { imageId: this.imageId };
      let result = await getDownvotes(params);
      this.downvotes = result.body.dbDownvotes;
      this.downvotesCount = this.downvotes.length;
      for (var downvote in this.downvotes) {
        if (this.$store.getters.user._id == this.downvotes[downvote].authorId) {
          this.imageIsDislikedbyCurrentUser = true;
          this.imageIsLikedbyCurrentUser = false;
          this.changeDownvoteVariant();
          this.changeUpvoteVariant();
        } else {
          this.imageIsDislikedbyCurrentUser = false;
          this.changeDownvoteVariant();
        }
      }
    },
    async fetchComments() {
      const params = { imageId: this.imageId };
      let result = await getComments(params);

      const dbComments = result.body;
      this.comments = dbComments;
      this.commentsCount = this.comments.length;
      this.prettifyCommentTime(this.comments);
    },
    prettifyCommentTime(comments) {
      comments.forEach(function (item, index) {
        console.log(item.creationDate + index);
        let d1 = moment(item.creationDate);
        item.creationDate = d1.format("ll") + " " + d1.format("HH:mm:ss");
      });
    },
    async getImages() {
      //get all images
      let result = await getMemes();
      if (result.status !== 200) {
        this.authorized = false;
        return;
      }
      this.allImages = result.body;
      //sort images by creation date
      this.allImages.sort(function (a, b) {
        return new Date(b.creationDate) - new Date(a.creationDate);
      });
      //filter for the current imageId
      this.image = this.allImages.filter((img) => img._id === this.imageId)[0];
      await this.updateStats();
      this.imageURL = getBackendMemeURL(this.image);

      for (var image in this.allImages) {
        if (this.imageId == this.allImages[image]._id) {
          this.currentImageIndex = image;
        }
      }
    },

    changeImage(index) {
      if (index == this.allImages.length) {
        index = 0;
        this.currentImageIndex = 0;
      } else if (index == -1) {
        index = this.allImages.length - 1;
        this.currentImageIndex = this.allImages.length - 1;
      }

      this.image = this.allImages[index];
      this.imageId = this.allImages[index]._id;
      this.fetchupvotes();
      this.fetchdownvotes();
      this.fetchComments();
    },

    downloadImage() {
      saveAs(this.imageURL, "meme" + this.image.fileType);
    },
  },
  async mounted() {
    // this.getImage();
    this.getImages();
    this.fetchComments();
    this.fetchupvotes();
    this.fetchdownvotes();
    this.changeUpvoteVariant();
    this.changeDownvoteVariant();
  },
};
</script>

<style scoped>
.imageContainer {
  /* width: -webkit-fill-available; */
  max-width: 50%;
}
commentBox {
  color: orange;
  background-color: green;
}
.text-large {
  font-size: 180%;
}
</style>
