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
        @click="increaseUpvotescount"
      >
        <b-icon icon="hand-thumbs-up" aria-hidden="true"></b-icon>
        Upvote</b-button
      >
      <b-button
        variant="outline-danger"
        class="m-3"
        @click="increaseDownvotescount"
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
      </b-row>
      <b-col
        class="justify-content-md-center"
        v-for="comment in comments"
        v-bind:key="comment._id"
      >
        <b-row style="background-color: #e6e6e6">
          <b-col>
            <strong>{{ comment.authorId }}</strong>
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
      upvotesCount: 0, //TODO: get the upvotescount from server
      downvotesCount: 0, //TODO: get the downvotescount from server
      commentsCount: 0,
      comments: [],
      commentInput: "",
    };
  },
  methods: {
    async submitComment() {
      console.log("Submitting comment...");
      var commentUrl = "http://localhost:3000/post-comment";
      var comment = {
        imageId: this.imageId,
        authorId: "TODO authorId",
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
        //this.$set(this.errors, "post-comment", error);
      } else {
        // success
        this.commentInput = "";
        this.fetchComments();
      }
    },
    increaseUpvotescount() {
      return this.upvotesCount++; // TODO: take image id and increment upvotes
    },

    increaseDownvotescount() {
      return this.downvotesCount++; //TODO: take image id and increment downvotes
    },
    async fetchComments() {
      var currentImageId = this.imageId;
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
  },
};
</script>

<style scoped>
commentBox {
  color: orange;
  background-color: green;
}
</style>
