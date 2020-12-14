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
            <router-link to = "/Meme">
            <img
              class="imageContainer"
              :src="'http://localhost:3000/static/' + image.nameAndFileType"
              @click="openMemeView()"
              />
            </router-link>
          </b-row>
          <b-row class="justify-content-md-center" cols="4">

            <b-button type="bu" variant="outline-success" class="m-3" @click="increaseUpvotescount">
               <b-icon icon="hand-thumbs-up" aria-hidden="true"></b-icon> Upvote</b-button>
            <b-button variant="outline-danger" class="m-3" @click="increaseDownvotescount"> 
              <b-icon icon="hand-thumbs-down" aria-hidden="true"></b-icon> Downvote</b-button>
            <b-button variant="outline-primary" class="m-3">
              <b-icon icon="chat-left" aria-hidden="true"></b-icon> Comments</b-button>            
          </b-row>

          <b-row class="justify-content-md-center" cols="4">
             <b-badge variant="light" class="m-3" >{{upvotesCount}} Upvotes </b-badge>  
             <b-badge variant="light" class="m-3">{{downvotesCount}} Downvotes </b-badge> 
              <b-badge variant="light" class="m-3">{{commentsCount}} Comments </b-badge>           
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

//import router from "../../router/index.js"

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
      upvotesCount: 0, //TODO: get the upvotescount from server
      downvotesCount: 0, //TODO: get the downvotescount from server
      commentsCount: 0, //TODO: get the commentsvotescount from server
   
    };
  },
  methods: {
    increaseUpvotescount(){
      return this.upvotesCount++; // TODO: take image id and increment upvotes 
    },

    increaseDownvotescount(){
      return this.downvotesCount++;  //TODO: take image id and increment downvotes
    },

    openMemeView(){
      console.log("image is clicked")
      //let routerData = router.push({name: "Meme"}).catch(err => {err});
      
      //window.open(routerData, '_blank');
      
    },
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