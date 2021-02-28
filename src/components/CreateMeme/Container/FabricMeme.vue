<template>
  <b-container class="justify-content-md-center" fluid>
    <b-row align-h="center" class="mb-3">
      <b-form-input
        v-model="title"
        type="text"
        placeholder="Title..."
        class="w-50"
      />
    </b-row>
    <b-row align-h="center" class="mb-3">
      <b-col>
        <canvas
          class="myCanvas"
          ref="can"
          id="c"
          :width="canvasWidth"
          :height="canvasHeight"
        ></canvas>
      </b-col>
      <b-col>
        <b-button
          class="mb-2"
          variant="outline-primary"
          v-on:click="addTextNormal"
          >Add normal caption</b-button
        >
        <b-button
          class="mb-2"
          variant="outline-primary"
          v-on:click="addTextItalic"
          >Add italic caption</b-button
        >
        <b-button
          class="mb-2"
          variant="outline-primary"
          v-on:click="addTextBold"
          >Add bold caption</b-button
        >
        <b-form-input
          v-model="textColor"
          @change="updateTextColor"
          class="w-25 mr-2 mb-2"
          type="color"
        ></b-form-input>

        <b-button class="mb-2" variant="outline-primary" v-on:click="unselect"
          >Unselect</b-button
        >

        <b-button class="mb-2" variant="outline-primary" v-on:click="toFront"
          >To Front</b-button
        >
        <b-button class="mb-2" variant="outline-primary" v-on:click="toBack"
          >To Back</b-button
        >

        <b-button
          class="mb-2"
          variant="outline-primary"
          v-on:click="useAsBackground"
          >As background</b-button
        >

        <b-form-checkbox
          v-model="drawingMode"
          name="drawingMode"
          switch
          @change="updateDrawingMode"
        >
          Draw Mode
        </b-form-checkbox>

        <b-row :style="{ visibility: drawingMode ? 'visible' : 'hidden' }">
          <b-input-group @change="updateDrawingMode" class="w-50 mr-2">
            <b-form-input
              v-model="brushSize"
              type="range"
              min="1"
              max="32"
              @change="updateDrawingMode"
            ></b-form-input>
          </b-input-group>
          <b-form-input
            v-model="color"
            @change="updateDrawingMode"
            class="w-25 mr-2"
            type="color"
          ></b-form-input>
        </b-row>
        <b-button class="mb-2" variant="danger" v-on:click="deleteSelected"
          >Delete selected</b-button
        >
        <b-form-input
          v-model="canvasWidth"
          @input="updateCanvasSize"
          number
          class="w-15"
          type="number"
        />
        <span class="m-2">x</span>
        <b-form-input
          v-model="canvasHeight"
          @input="updateCanvasSize"
          number
          class="w-15"
          type="number"
        />
      </b-col>
    </b-row>

    <b-row align-h="center" class="mb-1">
      <b-form-group>
        <b-form-radio-group
          id="visibility-radio-buttons"
          v-model="visibility"
          :options="visibilityOptions"
        >
        </b-form-radio-group>
      </b-form-group>
    </b-row>
    <b-row align-h="center" class="mb-3">
      <b-button
        size="sm"
        variant="outline-primary"
        class="my-2 my-sm-0 mr-2"
        :disabled="isLoading"
        v-on:click="savePngToDisk"
        >Save PNG to Disk</b-button
      >
      <b-button
        size="sm"
        variant="primary"
        class="my-2 my-sm-0 mr-2"
        :disabled="isLoading"
        v-on:click="savePngOnServer"
        >Submit Image</b-button
      >
      <b-button
        size="sm"
        variant="primary"
        class="my-2 my-sm-0 mr-2"
        :disabled="isLoading"
        v-on:click="saveVideoOnServer"
        >Submit Video</b-button
      >
      <b-button
        size="sm"
        variant="primary"
        class="my-2 my-sm-0 mr-2"
        :disabled="isLoading"
        v-on:click="saveGifOnServer"
        >Submit Gif</b-button
      >
    </b-row>
    <b-row align-h="center" class="mb-3">
      <div v-if="isLoading" class="loader"></div>
    </b-row>
    <b-row class="mb-3" align-h="center">
      <div>
        <customTemplate v-on:newTemplateSelected="addTemplate" />
      </div>
      <templates v-on:newTemplateSelected="addTemplate" />
    </b-row>
  </b-container>
</template>

<script>
import Templates from "../Templates/Templates";
import CustomTemplate from "../Templates/CustomTemplate";
import { fabric } from "fabric";
import gifjs from "gif.js";
// import ccapture from "ccapture.js";
import { fabricGif } from "../fabricUtils/fabricGif";
import { workerString } from "../fabricUtils/gif.worker";
import router from "../../../router/index.js";
import { saveAs } from "file-saver";
import { backendURL } from "../../../config";
import { upload } from "../../../api";

export default {
  name: "FabricMeme",
  components: {
    templates: Templates,
    customTemplate: CustomTemplate,
  },

  mounted() {
    const ref = this.$refs.can;
    const canvas = new fabric.Canvas(ref);
    this.canvas = canvas;
    this.canvas.preserveObjectStacking = true; // fix text disappearing behind image

    // patch fabric for cross domain image jazz
    fabric.Image.fromURL = function (d, f, e) {
      var c = fabric.document.createElement("img");
      c.onload = function () {
        if (f) {
          f(new fabric.Image(c, e));
        }
        c = c.onload = null;
      };
      c.setAttribute("crossOrigin", "anonymous");
      c.src = d;
    };
  },
  data() {
    return {
      canvas: 0,
      canvasWidth: 1000,
      canvasHeight: 500,
      title: "",
      isLoading: false,
      textColor: "#808080",
      drawingMode: false,
      brushSize: 1,
      color: "#808080",
      visibilityOptions: [
        { text: "Public", value: "public" },
        {
          text: "Unlisted",
          value: "unlisted",
        },
        {
          text: "Private",
          value: "private",
        },
      ],
      visibility: "public",
      templateImage:
        backendURL +
        "static-templates/0e71a5ba-5738-4234-9921-ac587870d8c9.png",
    };
  },
  methods: {
    async savePngToDisk() {
      this.unselect(); // otherwise selection UI is visible in output
      this.canvas.getElement().toBlob(function (blob) {
        saveAs(blob, "meme.png");
      });
    },
    unselect() {
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
    },
    async saveGifOnServer() {
      this.isLoading = true;
      this.unselect();
      var workerStr = workerString;
      var workerBlob = new Blob([workerStr], {
        type: "application/javascript",
      });

      var gif = new gifjs({
        workers: 2,
        workerScript: URL.createObjectURL(workerBlob),
        quality: 10,
        background: `#FFF`,
      });
      var canvasElement = document.getElementById("c");
      var delay = 50;
      for (var i = 0; i < (1000 / delay) * 5; i++) {
        gif.addFrame(canvasElement, { delay: delay });
      }

      gif.on("finished", (blob) => {
        // window.open(URL.createObjectURL(blob));
        this.isLoading = false;
        this.upload(blob, "gif.gif");
      });
      gif.render();
    },
    async saveVideoOnServer() {
      this.isLoading = true;
      this.unselect();
      var canvasElement = document.getElementById("c");

      const stream = canvasElement.captureStream();
      this.recorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });
      let allChunks = [];
      this.recorder.ondataavailable = function (e) {
        allChunks.push(e.data);
      };
      this.recorder.onstop = () => {
        const fullBlob = new Blob(allChunks, { type: "video/webm" });
        this.isLoading = false;
        this.upload(fullBlob, "video.webm");
      };
      // Start to record
      this.recorder.start();
      await new Promise((r) => setTimeout(r, 10000));
      this.recorder.stop();
    },
    async upload(blob, filename) {
      let data = new FormData();
      data.append("file", blob, filename);
      data.append("title", this.title);
      data.append("visibility", this.visibility);
      let result = await upload(data);
      if (result.status === 200) {
        router.push({ name: "Home" }).catch((err) => {
          err;
        });
      }
    },
    async savePngOnServer() {
      this.isLoading = true;
      this.unselect(); // otherwise selection UI is visible in output
      this.canvas.getElement().toBlob(async (blob) => {
        this.upload(blob, "file.png");
      });
      this.isLoading = true;
    },
    addTemplate(newImageUrl) {
      this.isLoading = true;
      if (newImageUrl.endsWith(".gif")) {
        console.log("Adding moving image: " + newImageUrl);
        this.addGif(newImageUrl);
        this.isLoading = false;
        return;
      }
      console.log("Adding static image: " + newImageUrl);
      let canvas = this.canvas;
      fabric.Image.fromURL(newImageUrl, function (oImg) {
        var img = oImg.scale(1.0).set({ left: 100, top: 100 });
        canvas.add(img);
      });
      this.isLoading = false;
    },
    addTextNormal() {
      this.canvas.add(
        new fabric.IText("new caption", {
          fontFamily: "Impact",
          left: 100,
          top: 100,
        })
      );
    },
    addTextItalic() {
      this.canvas.add(
        new fabric.IText("new caption", {
          fontFamily: "Impact",
          fontStyle: "italic",
          left: 100,
          top: 100,
        })
      );
    },
    addTextBold() {
      this.canvas.add(
        new fabric.IText("new caption", {
          fontFamily: "Impact",
          fontStyle: "bold",
          left: 100,
          top: 100,
          fill: this.textColor,
        })
      );
    },
    updateTextColor() {
      this.canvas.getActiveObject().set("fill", this.textColor);
      this.canvas.renderAll();
    },
    deleteSelected() {
      this.canvas.remove(this.canvas.getActiveObject());
      this.canvas
        .getActiveObjects()
        .forEach((element) => this.canvas.remove(element));
      this.unselect();
    },
    updateCanvasSize() {
      this.canvas.setWidth(this.canvasWidth);
      this.canvas.setHeight(this.canvasHeight);
    },
    toFront() {
      this.canvas.bringToFront(this.canvas.getActiveObject());
    },
    toBack() {
      this.canvas.sendToBack(this.canvas.getActiveObject());
    },
    async useAsBackground() {
      var activeObject = this.canvas.getActiveObject();
      this.canvasWidth = activeObject.width;
      this.canvasHeight = activeObject.height;
      this.updateCanvasSize();
      activeObject.set({ left: 0, top: 0, scaleX: 1.0, scaleY: 1.0, angle: 0 });
      this.toBack();
      // This is a workaround. The canvas is white until an interaction happens without this.
      await new Promise((resolve) => setTimeout(resolve, 100));
      this.unselect();
    },
    updateDrawingMode() {
      this.canvas.isDrawingMode = this.drawingMode;
      this.canvas.freeDrawingBrush.width = this.brushSize;
      this.canvas.freeDrawingBrush.color = this.color;
    },
    async addGif(url) {
      const canvas = this.canvas;
      const gif = await fabricGif(url, 200, 200);
      gif.set({ top: 50, left: 50 });
      canvas.add(gif);

      fabric.util.requestAnimFrame(function render() {
        canvas.renderAll();
        fabric.util.requestAnimFrame(render);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.imageContainer {
  width: -webkit-fill-available;
  max-width: 30%;
}
.myCanvas {
  box-shadow: 0px 0px 32px 2px grey;
}
#stage {
  border: solid 1px #cccccc;
}
.loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 45px;
  height: 45px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
