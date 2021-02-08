<template>
  <b-container class="justify-content-md-center" fluid>
    <div v-if="template_image">
      <b-row align-h="center" class="mb-3">
        <canvas
          class="myCanvas"
          ref="can"
          id="c"
          :width="canvas_width"
          :height="canvas_height"
        ></canvas>
      </b-row>
      <b-row align-h="center" class="mb-3">
        <b-button
          size="sm"
          variant="outline-primary"
          class="my-2 my-sm-0 mr-2"
          v-on:click="add_text_normal"
          >Add normal caption</b-button
        >
        <b-button
          size="sm"
          variant="outline-primary"
          class="my-2 my-sm-0 mr-2"
          v-on:click="add_text_italic"
          >Add italic caption</b-button
        >
        <b-button
          size="sm"
          variant="outline-primary"
          class="my-2 my-sm-0 mr-2"
          v-on:click="add_text_bold"
          >Add bold caption</b-button
        >
        <b-button
          size="sm"
          variant="outline-primary"
          class="my-2 my-sm-0 mr-2"
          v-on:click="switch_drawing_mode"
          >Drawing Mode toggle</b-button
        >
        <b-button
          size="sm"
          variant="danger"
          class="my-2 my-sm-0 mr-2"
          v-on:click="delete_selected"
          >Delete selected</b-button
        >
      </b-row>
      <b-row align-h="center" class="mb-3">
        <b-form-input
          v-model="canvas_width"
          @input="update_canvas_size"
          number
          style="min-width: 30px"
          class="w-20"
          type="number"
        />
        x
        <b-form-input
          v-model="canvas_height"
          @input="update_canvas_size"
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
    this.add_gif("https://media.giphy.com/media/11RwocOdukxqN2/giphy.gif");
  },
  data() {
    return {
      canvas: 0,
      canvas_width: 1000,
      canvas_height: 500,
      topText: { text: "TEXT HERE", offsetX: 100, offsetY: 30 },
      bottomText: { text: "B", offsetX: 30, offsetY: 100 },
      template_image:
        "http://localhost:3000/static-templates/0e71a5ba-5738-4234-9921-ac587870d8c9.png",
      final_image_path: "",
    };
  },
  methods: {
    addTemplate(newImageUrl) {
      if (newImageUrl.endsWith(".gif")) {
        console.log("Adding moving image: " + newImageUrl);
        this.add_gif(newImageUrl);
        return;
      }

      console.log("Adding static image: " + newImageUrl);
      let canvas = this.canvas;
      fabric.Image.fromURL(newImageUrl, function (oImg) {
        var img = oImg.scale(0.5).set({ left: 100, top: 100 });
        canvas.add(img);
      });
    },
    async render_on_server() {
      var render_simple_meme_url = new URL(
          "http://localhost:3000/render-simple-meme"
        ),
        params = {
          template_image_url: this.template_image,
          top_text: this.topText.text,
          bottom_text: this.bottomText.text,
          top_x: this.topText.offsetX,
          top_y: this.topText.offsetY,
          bott_x: this.bottomText.offsetX,
          bott_y: this.bottomText.offsetY,
        };
      render_simple_meme_url.search = new URLSearchParams(params).toString();
      let result = await fetch(render_simple_meme_url);
      const { path } = await result.json();
      this.final_image_path = path;
    },
    add_text_normal() {
      this.canvas.add(
        new fabric.IText("new caption", {
          fontFamily: "Impact",

          left: 100,
          top: 100,
        })
      );
    },
    add_text_italic() {
      this.canvas.add(
        new fabric.IText("new caption", {
          fontFamily: "Impact",
          fontStyle: "italic",
          left: 100,
          top: 100,
        })
      );
    },
    add_text_bold() {
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
    delete_selected() {
      this.canvas.remove(this.canvas.getActiveObject());
    },
    update_canvas_size() {
      this.canvas.setHeight(this.canvas_height);
      this.canvas.setWidth(this.canvas_width);
      // this.canvas.renderAll();
    },
    switch_drawing_mode() {
      this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
    },
    async add_gif(url) {
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
