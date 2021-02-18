<template>
  <b-container>
    {{ meme.url }}
    <b-img
      class="container"
      v-if="['.gif', '.jpeg', '.png'].includes(meme.fileType)"
      :src="getBackendMemeURL(meme)"
      @click="openMemeView(meme._id)"
    />
    <video
      class="container"
      :autoplay="autoplay"
      :controls="autoplay"
      @click="openMemeView(meme._id)"
      v-else
    >
      <source
        :src="getBackendMemeURL(meme)"
        :type="'video/' + meme.fileType.replace(/\./g, '')"
      />
    </video>
  </b-container>
</template>

<script>
import { getBackendMemeURL } from "../../helper";
export default {
  name: "Meme",
  props: {
    meme: Object,
    autoplay: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    getBackendMemeURL,
    openMemeView(id) {
      this.$emit("openMemeView", id);
    },
  },
};
</script>

<style scoped>
.container {
  width: -webkit-fill-available;
  display: block;
}
</style>