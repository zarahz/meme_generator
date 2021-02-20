<template>
  <b-container>
    <b-row> viewed: {{ viewed }} </b-row>
    <b-row> chosen: {{ chosen }} </b-row>
    <b-row> generated: {{ generated }} </b-row>
    <b-row> viewedAfterCreation: {{ viewedAfterCreation }} </b-row>
    <b-row> upvoted: {{ upvoted }} </b-row>
    <b-row> downvoted: {{ downvoted }} </b-row>
  </b-container>
</template>

<script>
export default {
  name: "Stats",
  props: {
    viewed: Number,
    chosen: Number,
    generated: Number,
    viewedAfterCreation: Number,
    upvoted: Number,
    downvoted: Number,
  },
};
</script>

<style scoped>
</style>