<template>
  <b-container class="justify-content-md-center" fluid>
    <div v-if="template_image">
      <b-row align-h="center" class="mb-3">
        <b-img class="imageContainer" :src="template_image" />
      </b-row>

      <b-row align-h="center" class="mb-3">
        <b-col cols="2">
          <label>Top Text:</label>
        </b-col>
        <b-col cols="auto">
          <b-form-input
            v-model="topText.text"
            class="w-100"
            type="text"
            placeholder="Top Text..."
          />
        </b-col>
        <b-col cols="1">
          <label>Location X:</label>
        </b-col>
        <b-col cols="1">
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
          <b-form-input
            v-model="topText.offsetY"
            style="min-width: 60px"
            class="w-50"
            type="text"
            placeholder="vertical offset"
          />
        </b-col>
      </b-row>
      <b-row align-h="center" class="mb-3">
        <b-col cols="2">
          <label>Bottom Text:</label>
        </b-col>
        <b-col cols="auto">
          <b-form-input
            v-model="bottomText.text"
            class="w-100"
            type="text"
            placeholder="Top Text..."
          />
        </b-col>
        <b-col cols="1">
          <label>Location X:</label>
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
      </b-row>

      <b-row align-h="center" class="mb-3">
        <b-button
          size="sm"
          variant="outline-primary"
          class="my-2 my-sm-0 mr-2"
          v-on:click="render_on_server"
          >Render on server</b-button
        >
      </b-row>
    </div>
    <b-row align-h="center" class="mb-3">
      <div v-if="final_image_path">
        <b-img class="imageContainer" :src="final_image_path" />
      </div>
      <div v-if="final_image_path">
        <b-button
          size="sm"
          variant="primary"
          class="my-2 my-sm-0 mr-2"
          v-on:click="submit"
          >Sumbit</b-button
        >
      </div>
    </b-row>

    <b-row class="mb-3" align-h="center">
      <templates v-on:newTemplateSelected="changeTemplate" />
    </b-row>
  </b-container>
</template>

<script>
import Templates from "./Templates.vue";

export default {
  name: "RenderMeme",
  components: {
    templates: Templates,
  },
  data() {
    return {
      topText: { text: "TEXT HERE", offsetX: 100, offsetY: 30 },
      bottomText: { text: "B", offsetX: 30, offsetY: 100 },
      template_image:
        "http://localhost:3000/static-templates/0e71a5ba-5738-4234-9921-ac587870d8c9.png",
      final_image_path: "",
    };
  },
  methods: {
    changeTemplate(newImageUrl) {
      console.log("CHANGING TEMPLATE");
      this.template_image = newImageUrl;
    },
    async render_on_server() {
      console.log("RENDERING");

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
      console.log(path);
      this.final_image_path = path;
    },
    async submit() {
      console.log("TODO Submit");
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
</style>
