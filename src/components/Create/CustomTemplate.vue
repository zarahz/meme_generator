<template>
  <b-container class="justify-content-md-center" fluid>
    <h3>Custom Templates</h3>
    <b-col cols="12" align-h="center">
      <b-row>
        <b-nav-form>
          <b-form-input
            v-on:enter="useWebScreenshotTemplate"
            v-model="screenshotUrl"
            size="sm"
            placeholder="Webpage to screenshot"
          ></b-form-input>
          <b-button size="sm" v-on:click="useWebScreenshotTemplate">✔</b-button>
        </b-nav-form>
      </b-row>
      <b-row>
        <b-nav-form>
          <b-form-input
            v-on:enter="useCustomTemplate"
            v-model="customUrl"
            size="sm"
            placeholder="Link to Image file"
          ></b-form-input>
          <b-button size="sm" v-on:click="useCustomTemplate">✔</b-button>
        </b-nav-form>
      </b-row>
      <b-row>
        <input id="imageUpload" type="file" @change="onFileSelected" hidden />
        <b-button variant="outline-primary" @click="chooseImage">
          {{ selectedFileName }}</b-button
        >
        <b-button size="sm" v-on:click="onUpload">✔</b-button>
      </b-row>
    </b-col>
  </b-container>
</template>

<script>
export default {
  name: "Templates",
  props: {
    searchString: String,
  },
  components: {},
  data() {
    return {
      customUrl: "",
      screenshotUrl: "",
      selectedFile: null,
      selectedFileName: "Upload local file",
      selectedImageUrl: null,
    };
  },
  methods: {
    useCustomTemplate() {
      this.$emit("newTemplateSelected", this.customUrl);
    },
    async useWebScreenshotTemplate() {
      var screenshotRequestUrl = new URL(
          "http://localhost:3000/screenshot_webpage"
        ),
        params = { webpage: this.screenshotUrl };
      screenshotRequestUrl.search = new URLSearchParams(params).toString();
      let result = await fetch(screenshotRequestUrl);
      const { dbTemplate } = await result.json();
      this.$emit("newTemplateSelected", dbTemplate.url);
    },
    chooseImage() {
      document.getElementById("imageUpload").click();
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = event.target.files[0].name;
      this.selectedImageUrl = URL.createObjectURL(this.selectedFile);
    },
    onUpload() {
      this.$emit("newTemplateSelected", this.selectedImageUrl);
    },
  },
  mounted() {},
};
</script>

<style scoped>
</style>