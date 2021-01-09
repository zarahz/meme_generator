<template>
  <b-container class="justify-content-md-center">
    <!--h2>the image id is :{{this.$route.params.id}}</h2-->
    <b-row
      class="justify-content-md-center"
      v-for="image in allImages"
      :key="image._id"
    >
      <b-col sm="7" align-self="center">
        <b-row v-if="imageId == image._id" class="justify-content-md-center">
          <b-row class="justify-content-md-center">
            <b-col />

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
            <b-col />
          </b-row>
          <b-img
            :src="'http://localhost:3000/static/' + image.nameAndFileType"
            alt="Center image"
          />
        </b-row>
      </b-col>
    </b-row>
    <b-row class="justify-content-md-center" cols="4">
      <b-button
        type="bu"
        variant="outline-success"
        class="m-3"
        @click="submitUpvote"
        :disabled="!$store.getters.isLoggedIn"
      >
        <b-icon icon="hand-thumbs-up" aria-hidden="true"></b-icon>
        Upvote</b-button
      >
      <b-button
        variant="outline-danger"
        class="m-3"
        @click="submitDownvote"
        :disabled="!$store.getters.isLoggedIn"
      >
        <b-icon icon="hand-thumbs-down" aria-hidden="true"></b-icon>
        Downvote</b-button
      >
      <b-button variant="outline-primary" class="m-3">
        <b-icon icon="chat-left" aria-hidden="true"></b-icon> Comments</b-button
      >
    </b-row>
    <b-row class="justify-content-md-center" cols="4">
      <b-badge variant="light" class="m-3">{{ upvotesCount }} Upvotes </b-badge>
      <b-badge variant="light" class="m-3"
        >{{ downvotesCount }} Downvotes
      </b-badge>
      <b-badge variant="light" class="m-3"
        >{{ commentsCount }} Comments
      </b-badge>
    </b-row>
    <b-col align-self="center">
      <b-row class="justify-content-md-center">
        <b-form-input
          v-on:keyup.enter="submitComment"
          v-model="commentInput"
          class="w-50"
          type="text"
          placeholder="Type your comment here..."
        />
        {{ commentErrorText }}
      </b-row>
      <b-col
        class="justify-content-md-center"
        v-for="comment in comments"
        v-bind:key="comment._id"
      >
        <b-row style="background-color: #e6e6e6">
          <b-col>
            <strong>{{ comment.username }}</strong>
          </b-col>
          <b-col>
            {{ comment.creationDate }}
          </b-col>
        </b-row>
        <b-row style="background-color: #e6e6e6" class="mb-2">
          <b-col>
            {{ comment.content }}
          </b-col>
        </b-row>
        <div></div>
      </b-col>
    </b-col>
  </b-container>
</template>
<script>
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
      allImages: [],
      upvotesCount: 0,
      upvotes: [],
      downvotesCount: 0,
      downvotes: [],
      commentsCount: 0,
      comments: [],
      commentInput: "",
      commentErrorText: "",
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
        authorId: this.$store.getters.user._id,
        content: this.commentInput,
      };
      console.log("Comment: " + comment);
      let result = await fetch(commentUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        this.fetchupvotes();
      }
    },
    async submitDownvote() {
      console.log("image disliked");
      var downvoteUrl = "http://localhost:3000/post-downvote";
      var downvote = {
        imageId: this.imageId,
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
    async getImages() {
      let result = await fetch("http://localhost:3000/images", {
        method: "GET",
      });
      const { dbImages } = await result.json();
      this.allImages = dbImages;
    },
  },
  mounted() {
    this.getImages();
    this.fetchComments();
    this.fetchupvotes();
    this.fetchdownvotes();
  },
};
</script>

<style scoped>
commentBox {
  color: orange;
  background-color: green;
}
</style>
