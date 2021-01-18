<template>
  <b-container class="justify-content-md-center" fluid>
    <h1>Create a Meme!</h1>
    <b-row align-h="center" class="mb-3">
      <b-col cols="2">
        <label>Top Text:</label>
      </b-col>
      <b-col cols="auto">
        <!--v-on:input="changeImageText"-->
        <b-form-input
          v-model="topText.text"
          class="w-100"
          type="text"
          placeholder="Top Text..."
        />
      </b-col>
      <b-col cols="1">
        <label>Offset X:</label>
      </b-col>
      <b-col cols="1">
        <!--v-on:input="changeImageText"-->
        <b-form-input
          v-model="topText.offsetX"
          style="min-width: 60px"
          class="w-50"
          type="text"
          placeholder="horizontal offset"
        />
      </b-col>
      <b-col cols="1">
        <label>Y:</label>
      </b-col>
      <b-col cols="1">
        <!--v-on:input="changeImageText"-->
        <b-form-input
          v-model="topText.offsetY"
          style="min-width: 60px"
          class="w-50"
          type="text"
          placeholder="vertical offset"
        />
      </b-col>
      <!--v-on:input="changeImageText"-->
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="topText.offsetX -= 5"
        >🡄</b-button
      >
      <!--v-on:input="changeImageText"-->
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="topText.offsetX += 5"
        >🡆</b-button
      >
      <!--v-on:input="changeImageText"-->
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="topText.offsetY -= 5"
        >🡅</b-button
      >
      <!--v-on:input="changeImageText"-->
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="topText.offsetY += 5"
        >🡇</b-button
      >
    </b-row>
    <b-row align-h="center" class="mb-3">
      <b-col cols="2">
        <label>Bottom Text:</label>
      </b-col>
      <b-col cols="auto">
        <!--v-on:input="changeImageText"-->
        <b-form-input
          v-model="bottomText.text"
          class="w-100"
          type="text"
          placeholder="Bottom Text..."
        />
      </b-col>
      <b-col cols="1">
        <label>Offset X:</label>
      </b-col>
      <b-col cols="1">
        <!--v-on:input="changeImageText"-->
        <b-form-input
          v-model="bottomText.offsetX"
          style="min-width: 60px"
          class="w-50"
          type="text"
          placeholder="horizontal offset"
        />
      </b-col>
      <b-col cols="1">
        <label>Y:</label>
      </b-col>
      <b-col cols="1">
        <!--v-on:input="changeImageText"-->
        <b-form-input
          v-model="bottomText.offsetY"
          style="min-width: 60px"
          class="w-50"
          type="text"
          placeholder="vertical offset"
        />
      </b-col>
      <!--v-on:input="changeImageText"-->
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="bottomText.offsetX -= 5"
        >🡄</b-button
      >
      <!--v-on:input="changeImageText"-->
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="bottomText.offsetX += 5"
        >🡆</b-button
      >
      <!--v-on:input="changeImageText"-->
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="bottomText.offsetY -= 5"
        >🡅</b-button
      >
      <!--v-on:input="changeImageText"-->
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="bottomText.offsetY += 5"
        >🡇</b-button
      >
    </b-row>

    <b-row align-h="center" class="mb-3">
      <drawingSettings
        @toggleCanvasDrawingMode="toggleCanvasDrawingMode"
        @clearCanvas="clearDrawingCanvas"
      />
    </b-row>

    <b-row class="mb-3">
      <b-col>
        <customCanvas
          :topText="topText"
          :bottomText="bottomText"
          :img="img"
          :drawingSettings="drawingSettings"
          ref="meme"
        />
      </b-col>
    </b-row>

    <b-row class="mb-3" align-h="center">
      <b-col cols="4" />
      <b-col>
        <b-button variant="outline-primary" v-on:click="saveOnServer">
          Submit Meme
        </b-button>
      </b-col>
      <b-col>
        <b-button variant="outline-primary" v-on:click="download">
          Download
        </b-button>
      </b-col>
      <b-col cols="4" />
    </b-row>
    <b-row class="mb-3" align-h="center">
      <div>
        <customTemplate v-on:newTemplateSelected="changeTemplate" />
      </div>
    </b-row>
    <b-row class="mb-3" align-h="center">
      <templates v-on:newTemplateSelected="changeTemplate" />
    </b-row>
  </b-container>
</template>

<script>
import { saveAs } from "file-saver";
import FormData from "form-data";
import router from "../../router/index.js";

import cassiusMeme from "@/assets/meme.jpg";

import Templates from "./Templates.vue";
import CustomTemplate from "./CustomTemplate.vue";
import CustomCanvas from "./CustomCanvas.vue";
import DrawingSettings from "./DrawingSettings";

export default {
  name: "CreateMeme",
  components: {
    templates: Templates,
    customTemplate: CustomTemplate,
    customCanvas: CustomCanvas,
    drawingSettings: DrawingSettings,
  },
  data() {
    return {
      topText: { text: "", offsetX: 0, offsetY: 30 },
      bottomText: { text: "", offsetX: 0, offsetY: -30 },
      img: "",
      pos: { x: 0, y: 0 },
      drawingSettings: { brushSize: "1px", color: "black", isErasing: false },
      memeSaved: false,
    };
  },
  methods: {
    clearDrawingCanvas() {
      this.$refs.meme.clearDrawingCanvas();
    },
    changeTemplate(newImageUrl) {
      this.img = newImageUrl;
    },
    toggleCanvasDrawingMode(drawMode, brushSize, color, isErasing) {
      if (drawMode) {
        this.drawingSettings = { brushSize, color, isErasing };
        this.$refs.meme.activateDrawingMode();
      } else {
        this.drawingSettings = null;
      }
    },
    download() {
      let canvas = this.$refs.meme.createResultingCanvas();
      canvas.toBlob(function (blob) {
        saveAs(blob, "meme.png");
      });
    },
    async saveOnServer() {
      let canvas = this.$refs.meme.createResultingCanvas();
      canvas.toBlob(async (blob) => {
        let data = new FormData();
        data.append("file", blob, "file.png");
        let result = await fetch("http://localhost:3000/upload", {
          method: "POST",
          headers: {
            Accept: "application/json",
            //"Content-Type": "multipart/form-data; boundary=70",
          },
          credentials: "include",
          body: data,
        });
        if (result.status === 200) {
          this.memeSaved = true;
          this.deleteDraft();
          router.push({ name: "Home" }).catch((err) => {
            err;
          });
        }
      });
    },
    async saveDraft() {
      let draftModel = {
        //TODO title
        topText: this.topText.text,
        topTextOffset: [this.topText.offsetX, this.topText.offsetY],
        bottomText: this.bottomText.text,
        bottomTextOffset: [this.bottomText.offsetX, this.bottomText.offsetY],
        memeSource: this.img,
      };
      await fetch("http://localhost:3000/image-draft", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(draftModel),
      });
    },
    async loadDraft() {
      let result = await fetch("http://localhost:3000/image-draft", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      if (result.status !== 200) {
        this.img = cassiusMeme; //Default img
      } else {
        const draft = await result.json();
        this.topText = {
          text: draft.topText,
          offsetX: draft.topTextOffset[0],
          offsetY: draft.topTextOffset[1],
        };
        this.bottomText = {
          text: draft.bottomText,
          offsetX: draft.bottomTextOffset[0],
          offsetY: draft.bottomTextOffset[1],
        };
        this.img = draft.memeSource;
      }
    },
    async deleteDraft() {
      await fetch("http://localhost:3000/delete-image-draft", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      });
    },
  },
  beforeDestroy() {
    if (!this.memeSaved) {
      this.saveDraft();
    }
  },
  created() {
    this.loadDraft();
  },
};
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Needed to outcomment the width or else the drawing bugs on window resize
 .customCanvas {
  max-width: 60%;
} */
</style>
