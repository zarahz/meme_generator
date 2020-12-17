<template>
 <b-container class="justify-content-md-center" >
   <!--h2>the image id is :{{this.$route.params.id}}</h2-->
    <b-row  
    class="justify-content-md-center"
    v-for="image in allImages" 
    :key="image._id">
    <b-col sm="7" align-self="center">
       <b-row v-if="imageId == image._id" class="justify-content-md-center">
      <b-img :src="'http://localhost:3000/static/' + image.nameAndFileType" alt="Center image"/>
      </b-row>
 </b-col>
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
    
 </b-container>
</template>
<script>
 export default{
  name:'MemePage',
  data(){
   return{
    imageId:this.$route.params.id,
    title:"Meme view",
    allImages: [],
     upvotesCount: 0, //TODO: get the upvotescount from server
      downvotesCount: 0, //TODO: get the downvotescount from server
      commentsCount: 0, //TODO: get the commentsvotescount from server
   };
  },
  methods:{
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
  },

 };
</script>