<template>
  <b-container class="justify-content-md-center" fluid>
    <h1>Create a Meme!</h1>
    <b-row align-h="center" class="mb-3">
      <b-col cols="2">
        <label>Top Text:</label>
      </b-col>
      <b-col cols="auto">
        <b-form-input
          v-on:input="changeImageText"
          v-model="topText"
          class="w-100"
          type="text"
          placeholder="Top Text..."
        />
      </b-col>
      <b-col cols="1">
        <label>Offset X:</label>
      </b-col>
      <b-col cols="1">
        <b-form-input
          v-on:input="changeImageText"
          v-model="topXOffset"
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
        <b-form-input
          v-on:input="changeImageText"
          v-model="topYOffset"
          style="min-width: 60px"
          class="w-50"
          type="text"
          placeholder="vertical offset"
        />
      </b-col>
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="
          topXOffset -= 5;
          changeImageText();
        "
        >🡄</b-button
      >
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="
          topXOffset += 5;
          changeImageText();
        "
        >🡆</b-button
      >
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="
          topYOffset -= 5;
          changeImageText();
        "
        >🡅</b-button
      >
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="
          topYOffset += 5;
          changeImageText();
        "
        >🡇</b-button
      >
    </b-row>
    <b-row align-h="center" class="mb-3">
      <b-col cols="2">
        <label>Bottom Text:</label>
      </b-col>
      <b-col cols="auto">
        <b-form-input
          v-on:input="changeImageText"
          v-model="bottomText"
          class="w-100"
          type="text"
          placeholder="Bottom Text..."
        />
      </b-col>
      <b-col cols="1">
        <label>Offset X:</label>
      </b-col>
      <b-col cols="1">
        <b-form-input
          v-on:input="changeImageText"
          v-model="bottomXOffset"
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
        <b-form-input
          v-on:input="changeImageText"
          v-model="bottomYOffset"
          style="min-width: 60px"
          class="w-50"
          type="text"
          placeholder="vertical offset"
        />
      </b-col>
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="
          bottomXOffset -= 5;
          changeImageText();
        "
        >🡄</b-button
      >
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="
          bottomXOffset += 5;
          changeImageText();
        "
        >🡆</b-button
      >
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="
          bottomYOffset -= 5;
          changeImageText();
        "
        >🡅</b-button
      >
      <b-button
        size="sm"
        class="my-2 my-sm-0 mr-2"
        v-on:click="
          bottomYOffset += 5;
          changeImageText();
        "
        >🡇</b-button
      >
    </b-row>

    <b-row align-h="center" class="mb-3">
      <drawingSettings @toggleCanvasDrawingMode="toggleCanvasDrawingMode" />
    </b-row>

    <b-row>
      <b-col>
        <canvas class="customCanvas" ref="memeCanvas" id="memeCanvas" />
      </b-col>
    </b-row>

    <b-row class="mb-3" align-h="center">
      <b-col cols="4" />
      <b-col>
        <b-button variant="outline-primary" v-on:click="submit">
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
      <customTemplate v-on:newTemplateSelected="changeTemplate" />
    </b-row>
    <b-row class="mb-3" align-h="center">
      <templates v-on:newTemplateSelected="changeTemplate" />
    </b-row>
  </b-container>
</template>

<script>
import cassiusMeme from "@/assets/meme.jpg";
import FormData from "form-data";
import { saveAs } from "file-saver";

import Templates from "./Templates.vue";
import CustomTemplate from "./CustomTemplate.vue";
import DrawingSettings from "./DrawingSettings";

export default {
  name: "CreateMeme",
  props: {
    msg: String,
  },
  components: {
    templates: Templates,
    customTemplate: CustomTemplate,
    drawingSettings: DrawingSettings,
  },
  data() {
    return {
      topText: "",
      topXOffset: 0,
      topYOffset: 30,
      bottomText: "",
      bottomXOffset: 0,
      bottomYOffset: -30,
      img: cassiusMeme,
      pos: { x: 0, y: 0 },
    };
  },
  methods: {
    changeTemplate(newImageUrl) {
      console.log("changing image to " + newImageUrl);
      this.img = newImageUrl;
      this.changeImageText();
    },
    changeImageText() {
      let canvas = this.$refs.memeCanvas;
      let context = canvas.getContext("2d");

      this.drawCanvasImage(canvas, context).then(() => {
        this.setCanvasTextStyle(context);
        // wait until picture finished loading and add text afterwards!
        let topCanvasHorizontalMid =
          canvas.width / 2 + parseInt(this.topXOffset);
        let bottomCanvasHorizontalMid =
          canvas.width / 2 + parseInt(this.bottomXOffset);
        console.log(
          topCanvasHorizontalMid + " and " + bottomCanvasHorizontalMid
        );
        let canvasBottom = canvas.height - Math.abs(this.bottomYOffset);
        //show top text

        context.fillText(
          this.topText,
          topCanvasHorizontalMid,
          this.topYOffset,
          canvas.width
        );
        context.strokeText(
          this.topText,
          topCanvasHorizontalMid,
          this.topYOffset,
          canvas.width
        );
        //show bottom text
        context.fillText(
          this.bottomText,
          bottomCanvasHorizontalMid,
          canvasBottom,
          canvas.width
        );
        context.strokeText(
          this.bottomText,
          bottomCanvasHorizontalMid,
          canvasBottom,
          canvas.width
        );
      });
    },
    drawCanvasImage(canvas, context) {
      return new Promise((resolve) => {
        let img = new Image();
        img.crossOrigin = "anonymous";
        img.src = this.img;
        img.onload = function () {
          let width = window.innerWidth;
          let height = window.innerHeight;
          // in order to show the picture in high resolution, set the canvas to the max height & width
          canvas.width = width;
          canvas.height = height;
          // calculate the scaled (down) image height & width to fit the canvas
          let imgWidth = img.width;
          let imgHeight = img.height;
          let scale = Math.min(
            canvas.width / imgWidth,
            canvas.height / imgHeight
          );
          // set the canvas back to the scaled values to maintain ratio and hight pic resolution
          let newImageWidth = imgWidth * scale;
          let newImageHeight = imgHeight * scale;
          canvas.width = newImageWidth;
          canvas.height = newImageHeight;

          context.mozImageSmoothingEnabled = false;
          context.imageSmoothingEnabled = false;
          context.webkitImageSmoothingEnabled = false;

          context.drawImage(
            img,
            0,
            0,
            imgWidth,
            imgHeight,
            0,
            0,
            newImageWidth,
            newImageHeight
          );

          // register that image loading is complete
          return resolve();
        };
      });
    },
    setCanvasTextStyle(context) {
      context.font = "50px Impact";
      context.fillStyle = "white";
      context.strokeStyle = "black";
      context.textBaseline = "middle";
      context.textAlign = "center";
    },
    toggleCanvasDrawingMode(drawMode, brushSize, color) {
      console.log(drawMode);
      let canvas = this.$refs.memeCanvas;
      if (drawMode) {
        canvas.addEventListener("mousemove", (e) => {
          this.draw(e, brushSize, color);
        });
        canvas.addEventListener("mousedown", this.setPosition);
      } else {
        //TODO remove event listeners properly here!
        console.log("remove event listeners properly here!");
      }
    },
    setPosition(e) {
      this.pos.x = e.offsetX;
      this.pos.y = e.offsetY;
    },
    draw(e, brushSize, color) {
      let canvas = this.$refs.memeCanvas;
      let ctx = canvas.getContext("2d");
      // mouse left button must be pressed
      if (e.buttons !== 1) return;

      ctx.beginPath(); // begin

      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.strokeStyle = color;

      ctx.moveTo(this.pos.x, this.pos.y); // from
      this.setPosition(e);
      ctx.lineTo(this.pos.x, this.pos.y); // to

      ctx.stroke(); // draw it!
    },
    loadCanvas() {
      let canvas = this.$refs.memeCanvas;
      let context = canvas.getContext("2d");
      this.drawCanvasImage(canvas, context).then(() =>
        this.setCanvasTextStyle(context)
      );
    },
    download() {
      let canvas = this.$refs.memeCanvas;
      canvas.toBlob(function (blob) {
        saveAs(blob, "meme.png");
      });
    },
    async submit() {
      let canvas = this.$refs.memeCanvas;
      canvas.toBlob(async (blob) => {
        let data = new FormData();
        data.append("file", blob, "file.png");
        let result = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: data,
        });
        if (result.status === 200) {
          console.log("image uploaded successfully to server!");
        }
      });
    },
  },
  mounted() {
    this.loadCanvas();
  },
};
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.customCanvas {
  max-width: 60%;
}
</style>
