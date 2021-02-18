<template>
  <b-container class="justify-content-md-center" fluid>
    <div v-if="templateImage">
      <b-row align-h="center" class="mb-3">
        <b-form-input
          v-model="title"
          type="text"
          placeholder="Title..."
          class="w-50"
        />
      </b-row>
      <b-row align-h="center" class="mb-3">
        <canvas
          class="myCanvas"
          ref="can"
          id="c"
          :width="canvasWidth"
          :height="canvasHeight"
        ></canvas>
      </b-row>
      <b-row align-h="center" class="mb-3">
        <b-button
          size="sm"
          variant="outline-primary"
          class="my-2 my-sm-0 mr-2"
          v-on:click="addTextNormal"
          >Add normal caption</b-button
        >
        <b-button
          size="sm"
          variant="outline-primary"
          class="my-2 my-sm-0 mr-2"
          v-on:click="addTextItalic"
          >Add italic caption</b-button
        >
        <b-button
          size="sm"
          variant="outline-primary"
          class="my-2 my-sm-0 mr-2"
          v-on:click="addTextBold"
          >Add bold caption</b-button
        >
        <b-button
          size="sm"
          variant="outline-primary"
          class="my-2 my-sm-0 mr-2"
          v-on:click="fix"
          >Unselect</b-button
        >
        <b-button
          size="sm"
          variant="outline-primary"
          class="my-2 my-sm-0 mr-2"
          v-on:click="switchDrawingMode"
          >Drawing Mode toggle</b-button
        >
        <b-button
          size="sm"
          variant="danger"
          class="my-2 my-sm-0 mr-2"
          v-on:click="deleteSelected"
          >Delete selected</b-button
        >
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
          v-on:click="savePngToDisk"
          >Save PNG to Disk</b-button
        >
        <b-button
          size="sm"
          variant="primary"
          class="my-2 my-sm-0 mr-2"
          v-on:click="saveOnServer"
          >Submit</b-button
        >
      </b-row>
      <b-row align-h="center" class="mb-3">
        <b-form-input
          v-model="canvasWidth"
          @input="updateCanvasSize"
          number
          style="min-width: 30px"
          class="w-20"
          type="number"
        />
        x
        <b-form-input
          v-model="canvasHeight"
          @input="updateCanvasSize"
          number
          style="min-width: 30px"
          class="w-20"
          type="number"
        />
      </b-row>
    </div>
    <b-row class="mb-3" align-h="center">
      <div>
        <customTemplate v-on:newTemplateSelected="addTemplate" />
      </div>
      <templates v-on:newTemplateSelected="addTemplate" />
    </b-row>
  </b-container>
</template>

<script>
import Templates from "../CreateMeme/Templates.vue";
import CustomTemplate from "../CreateMeme/CustomTemplate.vue";
import { fabric } from "fabric";
import { fabricGif } from "./fabricGif";
import { ccapture_js_npmfixed } from "ccapture.js-npmfixed";
import router from "../../router/index.js";
import { saveAs } from "file-saver";
import { backendURL } from "../../config";
import { upload } from "../../api";

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

    // example gif file
    //this.addGif("https://media.giphy.com/media/11RwocOdukxqN2/giphy.gif");
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
      visibilityOptions: [
        { text: "Public (list the finished meme publicly)", value: "public" },
        {
          text: "Unlisted (only people with the link can see the meme)",
          value: "unlisted",
        },
        {
          text: "Private (only you can see the finished meme)",
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
      this.canvas.discardActiveObject(); // otherwise selection UI is visible in output
      this.canvas.getElement().toBlob(function (blob) {
        saveAs(blob, "meme.png");
      });
    },
    fix() {
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
    },
    async saveGifToDisk() {
      var capturer = new ccapture_js_npmfixed.CCapture({
        format: "gif",
        workersPath: "js/",
        framerate: 20,
        verbose: true,
        name: "meme.gif",
      });
      capturer.start();
      this.canvas.on("after:render", () => {
        capturer.capture(this.canvas);
      });
      await new Promise((r) => setTimeout(r, 3000));
      capturer.stop();
      capturer.save();
    },
    async saveOnServer() {
      this.canvas.discardActiveObject(); // otherwise selection UI is visible in output
      this.canvas.getElement().toBlob(async (blob) => {
        let data = new FormData();
        data.append("visibility", this.visibility);
        data.append("file", blob, "file.png");
        data.append("title", this.title);
        let result = await upload(data);
        if (result.status === 200) {
          router.push({ name: "Home" }).catch((err) => {
            err;
          });
        }
      });
    },
    addTemplate(newImageUrl) {
      if (newImageUrl.endsWith(".gif")) {
        console.log("Adding moving image: " + newImageUrl);
        this.addGif(newImageUrl);
        return;
      }
      console.log("Adding static image: " + newImageUrl);
      let canvas = this.canvas;
      fabric.Image.fromURL(newImageUrl, function (oImg) {
        var img = oImg.scale(0.5).set({ left: 100, top: 100 });
        canvas.add(img);
      });
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
        })
      );
    },
    undo() {
      var objects = this.canvas.getObjects(); // get all objects on canvas (rect will be first and only)

      if (objects.length > 0) {
        this.canvas.remove(objects[objects.length - 1]); // remove previously-added fabric.Rect
      }
    },
    deleteSelected() {
      this.canvas.remove(this.canvas.getActiveObject());
    },
    updateCanvasSize() {
      this.canvas.setHeight(this.canvasHeight);
      this.canvas.setWidth(this.canvasWidth);
      // this.canvas.renderAll();
    },
    switchDrawingMode() {
      this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
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
</style>
