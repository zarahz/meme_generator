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
      <b-row>
        <b-button
          variant="outline-primary"
          :class="{ 'is-primary': !isCameraOpen, 'is-danger': isCameraOpen }"
          @click="toggleCamera"
        >
          <span v-if="!isCameraOpen">Open Camera</span>
          <span v-else>Close Camera</span>
        </b-button>
      </b-row>

      <b-row>
        <div v-if="isCameraOpen" class="camera-box">
          <video ref="camera" :width="450" :height="300" autoplay></video>
          <canvas
            v-show="isPhotoTaken"
            id="photoTaken"
            ref="canvas"
            :width="450"
            :height="300"
          ></canvas>
        </div>
      </b-row>
      <b-row>
        <div v-if="isCameraOpen" class="camera-shoot">
          <b-button type="button" size="sm" class="button" @click="takePhoto">
            <b-icon icon="camera" font-scale="2"></b-icon>
          </b-button>
        </div>
        <div v-if="isPhotoTaken && isCameraOpen" class="camera-download">
          <b-button
            size="sm"
            id="downloadPhoto"
            download="my-photo.jpg"
            class="button"
            v-on:click="onUploadCapturedImage"
            >✔</b-button
          >
        </div>
      </b-row>
    </b-col>
  </b-container>
</template>

<script>
import { getWebpageScreenshot } from "../../../api";

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
      isCameraOpen: false,
      isPhotoTaken: false,
    };
  },
  methods: {
    useCustomTemplate() {
      this.$emit("newTemplateSelected", this.customUrl);
    },
    async useWebScreenshotTemplate() {
      const params = { webpage: this.screenshotUrl };
      let result = await getWebpageScreenshot(params);
      const { dbTemplate } = result.body;
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
      this.selectedFileName = "Upload local file";
    },
    toggleCamera() {
      if (this.isCameraOpen) {
        this.isCameraOpen = false;
        this.isPhotoTaken = false;
        this.stopCameraStream();
      } else {
        this.isCameraOpen = true;
        this.createCameraElement();
      }
    },
    createCameraElement() {
      // constrains is a parameter describing the media types requested
      const constraints = (window.constraints = {
        // audio is set to false since we only need caputre images not videos
        audio: false,
        video: true,
      });
      // from this call we received a stream that going to be assigned to the <video></video> element
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.$refs.camera.srcObject = stream;
        })
        .catch((error) => {
          alert("an Error occured: " + error);
        });
    },
    stopCameraStream() {
      // to stop camera from streaming after closing it we catch the tracks on the camera element and then stop it
      let tracks = this.$refs.camera.srcObject.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });
    },
    takePhoto() {
      this.isPhotoTaken = !this.isPhotoTaken;

      const context = this.$refs.canvas.getContext("2d");
      context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);
    },
    onUploadCapturedImage() {
      const capturedImageUrl = document
        .getElementById("photoTaken")
        .toDataURL("image/jpeg");
      this.$emit("newTemplateSelected", capturedImageUrl);
      this.stopCameraStream();
      this.isCameraOpen = false;
      this.isPhotoTaken = false;
    },
  },
  mounted() {},
};
</script>

<style scoped>
</style>