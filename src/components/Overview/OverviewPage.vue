<!-- Overview page for endless scroll -> calls meme.vue with header and src information to display memes -->
<template>
  <b-container class="justify-content-md-center" fluid>
    <b-row
      cols-sm="4"
      class="mb-4"
      v-for="image in displayedImages"
      v-bind:key="image._id"
    >
      <b-col style="border: 3px solid green" />
      <b-col sm="6" align-self="center">
        <div>
          <b-row>
            <img
              class="imageContainer"
              :src="'http://localhost:3000/static/' + image.nameAndFileType"
             >
              
                 
              />
          </b-row>
          <b-row class="justify-content-md-center">
            <b-button variant="outline-success" class="m-3">Upvote</b-button>
            <b-button variant="outline-danger" class="m-3">Downvote</b-button>
            <b-button variant="outline-primary" class="m-3">Comments</b-button>            
          </b-row>
      
          <b-row b-row class="mb-3" align-h="center">
            <b-col cols="2" />
            <b-col>
              <facebook :url="'http://localhost:3000/static/' + image.nameAndFileType" scale="3"  ></facebook>
            </b-col>
            <b-col>
              <twitter :url="'http://localhost:3000/static/' + image.nameAndFileType" title="" scale="3" ></twitter>           
            </b-col>
            <b-col>
                <linkedin :url="'http://localhost:3000/static/' + image.nameAndFileType" scale="3" ></linkedin>
            </b-col>
            <b-col>
                <whats-app :url="'http://localhost:3000/static/' + image.nameAndFileType" title="Hello" scale="3" ></whats-app>
            </b-col>

            <b-col>
                <pinterest :url="'http://localhost:3000/static/' + image.nameAndFileType" scale="3" class="m-3"></pinterest>
            </b-col>
             <b-col>
                <email :url="'http://localhost:3000/static/' + image.nameAndFileType" subject="Hello" scale="3" ></email>

            </b-col>
           <b-col cols="2" />
          </b-row>

        </div>
      </b-col>
      <b-col style="border: 3px solid green">Hallo</b-col>
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
  Email
  
} from "vue-socialmedia-share";

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
     
    };
  },
  methods: {

    async getImages() {
      let result = await fetch("http://localhost:3000/images", {
        method: "GET",
      });
      const { dbImages } = await result.json();
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
  },
};
</script>

<style scoped>
.imageContainer {
  width: -webkit-fill-available;
}
</style>