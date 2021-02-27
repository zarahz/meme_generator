<template>
  <b-container>
    <b-row align-h="center" fluid>
      <b-col cols="6">
        <b-button
          :variant="currentUserVote === 'up' ? 'success' : 'outline-success'"
          class="m-1"
          :style="!enableCommenting && 'font-size: small'"
          :disabled="!$store.getters.isLoggedIn"
          @click="vote(true)"
          :title="!$store.getters.isLoggedIn && 'Log in to like this meme!'"
        >
          <b-icon icon="hand-thumbs-up" aria-hidden="true" />
          {{ upvotes.length }}
        </b-button>
        <b-button
          :variant="currentUserVote === 'down' ? 'danger' : 'outline-danger'"
          class="m-1"
          :style="!enableCommenting && 'font-size: small'"
          :disabled="!$store.getters.isLoggedIn"
          @click="vote(false)"
          :title="!$store.getters.isLoggedIn && 'Log in to dislike this meme!'"
        >
          <b-icon icon="hand-thumbs-down" aria-hidden="true" />
          {{ downvotes.length }}
        </b-button>
        <b-button
          variant="outline-primary"
          class="m-1"
          :style="!enableCommenting && 'font-size: small'"
          :disabled="!$store.getters.isLoggedIn"
          @click="navigateToMemePage"
          :title="!$store.getters.isLoggedIn && 'Log in to comment!'"
        >
          <b-icon icon="chat-left" aria-hidden="true" />
          {{ commmentCount }}
        </b-button>
        <b-button
          v-if="enableCommenting"
          variant="outline-primary"
          class="m-1"
          @click="downloadImage"
          :disabled="!['.gif', '.jpeg', '.png'].includes(image.fileType)"
        >
          <b-icon icon="download" aria-hidden="true"></b-icon>
        </b-button>
      </b-col>
      <b-col cols="6">
        <twitter
          :url="getFrontendMemeURL(image)"
          title="Hello from PENG MEMES"
          :scale="enableCommenting ? '3' : '2'"
          class="m-1 pointer"
        ></twitter>
        <linkedin
          :url="getFrontendMemeURL(image)"
          :scale="enableCommenting ? '3' : '2'"
          class="m-1 pointer"
        ></linkedin>
        <whats-app
          :url="getFrontendMemeURL(image)"
          title="Hello from PENG MEMES"
          :scale="enableCommenting ? '3' : '2'"
          class="m-1 pointer"
        ></whats-app>
        <pinterest
          :url="getFrontendMemeURL(image)"
          :scale="enableCommenting ? '3' : '2'"
          class="m-1 pointer"
        ></pinterest>
        <email
          :url="getFrontendMemeURL(image)"
          subject="Hello from PENG MEMES"
          :scale="enableCommenting ? '3' : '2'"
          class="m-1 pointer"
        ></email>
      </b-col>
    </b-row>

    <b-row
      align-h="center"
      v-if="$store.getters.isLoggedIn && enableCommenting"
    >
      <b-form-input
        v-on:keyup.enter="createComment"
        v-model="newComment"
        class="w-50 m-3"
        type="text"
        placeholder="Type your comment here..."
      />
    </b-row>

    <b-container v-if="enableCommenting">
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
    </b-container>
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
import moment from "moment";

import { saveAs } from "file-saver";

import {
  getDownvotes,
  postComment,
  postUpvote,
  getComments,
  getUpvotes,
  postDownvote,
} from "../../api";

import { getBackendMemeURL, getFrontendMemeURL } from "../../helper";

export default {
  props: {
    image: Object,
    enableCommenting: { type: Boolean, default: false },
  },
  components: {
    Twitter,
    Linkedin,
    Pinterest,
    WhatsApp,
    Email,
  },
  data() {
    return {
      upvotes: 0,
      downvotes: 0,
      commmentCount: 0,
      comments: [],
      newComment: "",
      commentError: "",
      currentUserVote: "", //'up' = userlike, 'down' = userdislike, '' = no vote from current user!
    };
  },
  methods: {
    getFrontendMemeURL,
    setUserVote(votes, voteString) {
      const currentUserVotes = votes.filter((vote) => {
        return this.$store.getters.user._id === vote.authorId;
      });
      if (currentUserVotes.length) {
        this.currentUserVote = voteString;
      }
    },
    async loadVotes() {
      const params = { imageId: this.image._id };
      //upvotes
      let upvotesResult = await getUpvotes(params);
      this.upvotes = upvotesResult.body.dbUpvotes;

      //downvotes
      let downvotesResult = await getDownvotes(params);
      this.downvotes = downvotesResult.body.dbDownvotes;

      if (this.$store.getters.isLoggedIn) {
        this.setUserVote(this.upvotes, "up");
        this.setUserVote(this.downvotes, "down");
      }
      this.$emit("userVoted", this.upvotes, this.downvotes);
    },
    async loadComments() {
      let result = await getComments({ imageId: this.image._id });
      const dbComments = result.body;
      this.comments = dbComments.map((comment) => {
        //prettify dates
        let date = moment(comment.creationDate);
        comment.creationDate =
          date.format("ll") + " " + date.format("HH:mm:ss");
        return comment;
      });
      this.commmentCount = this.comments.length;
    },
    async createComment() {
      var comment = {
        imageId: this.image._id,
        content: this.newComment,
      };
      let result = await postComment(comment);
      if (result.status === 200) {
        this.newComment = "";
        this.loadComments();
      }
    },
    async vote(userUpvoted) {
      let result = null;
      if (userUpvoted) {
        result = await postUpvote({ imageId: this.image._id });
      } else {
        result = await postDownvote({ imageId: this.image._id });
      }
      if (result.status === 200) {
        this.loadVotes();
      }
    },
    navigateToMemePage() {
      if (!this.enableCommenting) {
        this.$router
          .push({ name: "MemePage", params: { id: this.image._id } })
          .catch((err) => {
            err;
          });
      }
    },
    downloadImage() {
      const imageURL = getBackendMemeURL(this.image);
      saveAs(imageURL, "meme" + this.image.fileType);
    },
  },
  mounted() {
    this.loadVotes();
    this.loadComments();
  },
  watch: {},
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.small-font {
  font-size: small;
}
</style>