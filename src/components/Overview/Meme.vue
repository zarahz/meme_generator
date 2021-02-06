<template>
  <b-container class="justify-content-md-center">
    <div v-if="authorized">
      <b-row align-h="center" class="pull-right text-large">
        {{ image.title }}
      </b-row>
      <b-row align-h="center">
        <b-img class="imageContainer" :src="image.url" />
      </b-row>
      <b-row align-h="center" class="m-3">
        <b-col>
          <b-button
            variant="outline-success"
            class="ml-3"
            @click="submitUpvote"
            :disabled="!$store.getters.isLoggedIn"
          >
            <b-icon icon="hand-thumbs-up" aria-hidden="true"></b-icon>
            {{ upvotesCount }}</b-button
          >
          <b-button
            variant="outline-danger"
            class="ml-3"
            @click="submitDownvote"
            :disabled="!$store.getters.isLoggedIn"
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
            @click="downloadImage"
          >
            <b-icon icon="download" aria-hidden="true"></b-icon>
          </b-button>

          <twitter
            :url="'http://localhost:3000/static/' + imageId"
            title="Hello from PENG MEMES"
            scale="3"
            class="ml-3"
            style="cursor: pointer"
          ></twitter>
          <linkedin
            :url="'http://localhost:3000/static/' + imageId"
            scale="3"
            class="ml-3"
            style="cursor: pointer"
          ></linkedin>
          <whats-app
            :url="'http://localhost:3000/static/' + imageId"
            title="Hello from PENG MEMES"
            scale="3"
            class="ml-3"
            style="cursor: pointer"
          ></whats-app>
          <pinterest
            :url="'http://localhost:3000/static/' + imageId"
            scale="3"
            class="ml-3"
            style="cursor: pointer"
          ></pinterest>
          <email
            :url="'http://localhost:3000/static/' + imageId"
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
    </div>
    <div v-else>
      Oh Oh, it seems like you are not authorized to see this meme! :(
    </div>
  </b-container>
</template>
<script>
import { saveAs } from "file-saver";
import {
  Twitter,
  Linkedin,
  Pinterest,
  WhatsApp,
  Email,
} from "vue-socialmedia-share";

export default {
  name: "MemePage",
  components: {
    Twitter,
    Linkedin,
    Pinterest,
    WhatsApp,
    Email,
  },

  data() {
    return {
      imageId: this.$route.params.id,
      title: "Meme view",
      image: {},
      // allImages: [], not needed for now, get as parameter from overview later for the navigation button (next/previous meme)
      upvotesCount: 0,
      upvotes: [],
      downvotesCount: 0,
      downvotes: [],
      commentsCount: 0,
      comments: [],
      commentInput: "",
      commentErrorText: "",
      authorized: true,
    };
  },
  methods: {
    async submitComment() {
      if (this.$store.getters.user == null) {
        console.log("Not logged in");
        this.commentErrorText = "You need to login to comment.";
        return;
      }
      this.commentErrorText = "Submitting comment...";
      console.log("Submitting comment...");
      var commentUrl = "http://localhost:3000/post-comment";
      var comment = {
        imageId: this.imageId,
        content: this.commentInput,
      };
      console.log("Comment: " + comment);
      let result = await fetch(commentUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(comment),
      });
      if (result.status !== 200) {
        const { error } = await result.json();
        console.log(error);
        this.commentErrorText = "Error submitting comment: " + error;
        //this.$set(this.errors, "post-comment", error);
      } else {
        // success
        this.commentInput = "";
        this.commentErrorText = "Comment submitted!";
        this.fetchComments();
      }
    },
    async submitUpvote() {
      console.log("image liked");
      var upvoteUrl = "http://localhost:3000/post-upvote";
      var upvote = {
        imageId: this.imageId,
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
        this.fetchupvotes();
      }
    },
    async submitDownvote() {
      console.log("image disliked");
      var downvoteUrl = "http://localhost:3000/post-downvote";
      var downvote = {
        imageId: this.imageId,
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
        this.fetchdownvotes();
      }
    },

    async fetchupvotes() {
      var currentImageId = this.imageId;
      var upvoteUrl = new URL("http://localhost:3000/upvotes"),
        params = { imageId: currentImageId };
      Object.keys(params).forEach((key) =>
        upvoteUrl.searchParams.append(key, params[key])
      );
      let result = await fetch(upvoteUrl);
      const { dbUpvotes } = await result.json();
      this.upvotes = dbUpvotes;
      this.upvotesCount = this.upvotes.length;
    },

    async fetchdownvotes() {
      var currentImageId = this.imageId;
      var downvoteUrl = new URL("http://localhost:3000/downvotes"),
        params = { imageId: currentImageId };
      Object.keys(params).forEach((key) =>
        downvoteUrl.searchParams.append(key, params[key])
      );
      let result = await fetch(downvoteUrl);
      const { dbDownvotes } = await result.json();
      this.downvotes = dbDownvotes;
      this.downvotesCount = this.downvotes.length;
    },
    async fetchComments() {
      var currentImageId = this.imageId; // only used once, simplify
      var commentUrl = new URL("http://localhost:3000/comments"),
        params = { imageId: currentImageId };
      Object.keys(params).forEach((key) =>
        commentUrl.searchParams.append(key, params[key])
      );
      let result = await fetch(commentUrl);

      const dbComments = await result.json();
      this.comments = dbComments;
      this.commentsCount = this.comments.length;
    },
    async getImage() {
      var url = new URL("http://localhost:3000/image");
      url.searchParams.append("_id", this.imageId);
      let result = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      if (result.status === 200) {
        const { image } = await result.json();
        this.image = image;
        //additionally save the url into the img object since it is needed multiple times
        this.image.url =
          "http://localhost:3000/static/" + image.nameAndFileType;
      } else if (result.status === 401) {
        this.authorized = false;
      }
    },
    downloadImage() {
      saveAs(this.image.url, "meme.png");
    },
  },
  mounted() {
    this.getImage();
    this.fetchComments();
    this.fetchupvotes();
    this.fetchdownvotes();
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
