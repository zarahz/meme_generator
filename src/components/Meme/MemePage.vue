<template>
  <b-container class="justify-content-md-center">
    <div v-if="authorized && image && image.fileType">
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

      <meme-button-bar
        ref="memeButtonBar"
        :image="image"
        :enableCommenting="true"
        @userVoted="loadVotes"
      />

      <b-row>
        <!-- STATS! -->
        <meme-statistics
          v-if="image.memeStats"
          :upvoteDates="upvotesDates"
          :downvoteDates="downvotesDates"
          :viewDates="image.memeStats.viewed"
          :viewAfterCreationDates="
            image.templateStats ? image.templateStats.viewedAfterCreation : []
          "
          :generatedDates="
            image.templateStats ? image.templateStats.generated : []
          "
        />
        <div v-else>{{ image.memeStats }}</div>
      </b-row>
    </div>
    <div v-else-if="authorized && !image">No image found :/</div>
    <div v-else>
      Oh Oh, it seems like you are not authorized to see this meme! :(
    </div>
  </b-container>
</template>
<script>
import router from "../../router/index.js";

import {
  getMemes,
  updateMultipleTemplatesViewedAfterCreationStats,
  updateMultipleMemesViewedStats,
  getMeme,
} from "../../api";
import Meme from "./Meme";
import MemeStatistics from "./Stats/Stats";
import MemeButtonBar from "./MemeButtonBar";

export default {
  name: "MemePage",

  components: {
    Meme,
    MemeStatistics,
    MemeButtonBar,
  },

  data() {
    return {
      imageId: this.$route.params.id,
      imageURL: "",
      title: "Meme view",
      image: {},
      allImages: [],
      upvotesDates: [],
      downvotesDates: [],
      authorized: true,
      currentImageIndex: 0,
    };
  },
  methods: {
    async updateStats() {
      let templateStatsResult = await updateMultipleTemplatesViewedAfterCreationStats(
        [this.image]
      );
      let imageStatsResult = await updateMultipleMemesViewedStats([this.image]);
      this.$set(this.image, "memeStats", imageStatsResult.body[0]);
      this.$set(this.image, "templateStats", templateStatsResult.body[0]);
    },
    async getImages() {
      //get all (public) images
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

      if (!this.image) {
        //image could be unlisted, so try to get the image by id!
        let result = await getMeme({ _id: this.imageId });
        if (result.status === 401) {
          // still no positive result so set to unauthorized!
          this.authorized = false;
          return;
        }
        this.image = result.body.image;
      }
      await this.updateStats();

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
      const newImageId = this.allImages[index]._id;
      router
        .replace({ name: "MemePage", params: { id: newImageId } })
        .catch((err) => {
          err;
        });
    },
    loadVotes(upvotes, downvotes) {
      this.upvotesDates = upvotes.map((upvote) => upvote.creationDate);
      this.downvotesDates = downvotes.map((downvote) => downvote.creationDate);
    },
  },
  async mounted() {
    this.getImages();
  },
  watch: {
    $route(to, from) {
      // react to route changes...
      if (to !== from) {
        location.reload();
      }
    },
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
