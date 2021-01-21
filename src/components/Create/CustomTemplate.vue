<template>
  <b-container class="justify-content-md-center" fluid>
    <h3>Select Webpage to screenshot</h3>
    <b-row align-h="center">
      <b-col cols="4">
        <b-row align-h="center">
          <b-nav-form>
            <b-form-input
              v-on:enter="useWebScreenshotTemplate"
              v-model="screenshotUrl"
              size="sm"
              class="mr-sm-2"
              placeholder="Webpage to screenshot"
            ></b-form-input>
            <b-button
              size="sm"
              class="my-2 my-sm-0"
              v-on:click="useWebScreenshotTemplate"
              >✔</b-button
            >
          </b-nav-form>
        </b-row>
      </b-col>
    </b-row>

    <h3>Upload from url</h3>
    <b-row align-h="center">
      <b-col cols="2">
        <b-row align-h="center">
          <b-nav-form>
            <b-form-input
              v-on:enter="useCustomTemplate"
              v-model="customUrl"
              size="sm"
              class="mr-sm-2"
              placeholder="Link to Image file"
            ></b-form-input>
            <b-button
              size="sm"
              class="my-2 my-sm-0"
              v-on:click="useCustomTemplate"
              >✔</b-button
            >
          </b-nav-form>
        </b-row>
      </b-col>
    </b-row>

    <h3>Upload a template</h3>
    <b-row align-h="center">
      <b-col cols="2">
        <b-row class="justify-content-md-center">
          <input id="imageUpload" type="file" @change="onFileSelected" hidden />
          <b-button @click="chooseImage">
            <b-icon icon="camera-fill" aria-hidden="true"></b-icon
          ></b-button>
          <label id="idFileName"> {{ selectedFileName }}</label>

          <button
            button
            type="button"
            class="btn btn-light"
            v-on:click="onUpload"
          >
            ok
          </button>
        </b-row>
      </b-col>
    </b-row>
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
      selectedFileName: "",
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