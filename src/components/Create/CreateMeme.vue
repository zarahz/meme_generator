<template>
  <b-container class="justify-content-md-center" fluid>
    <b-alert
      variant="success"
      dismissible
      fade
      :show="draftSaved"
      @dismissed="draftSaved = false"
    >
      Draft saved successfully!
    </b-alert>

    <h1>Create a Meme!</h1>

    <div v-if="img">
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
        <b-col cols="1">
          <label>Title:</label>
        </b-col>
        <b-col cols="auto">
          <b-form-input
            v-model="title"
            class="w-100"
            type="text"
            placeholder="Title..."
          />
        </b-col>
        <b-col>
          <label>Size:</label>
          <b-button
            type="button"
            class="btn btn-default btn-sm"
            variant="outline-primary"
            v-on:click="changeFontSize(--fontSize)"
          >
            -
          </b-button>
          <b-button
            type="button"
            class="btn btn-default btn-sm"
            variant="outline-primary"
            v-on:click="changeFontSize(++fontSize)"
          >
            +
          </b-button>
        </b-col>
        {{ fontSize }}
        <b-col>
          <b-button-group>
            <b-button title="Bold">
              <b-icon icon="type-bold" aria-hidden="true"></b-icon>
            </b-button>
            <b-button title="Italic">
              <b-icon icon="type-italic" aria-hidden="true"></b-icon>
            </b-button>
            <b-button title="Underline">
              <b-icon icon="type-underline" aria-hidden="true"></b-icon>
            </b-button>
            <b-button title="Strikethrough">
              <b-icon icon="type-strikethrough" aria-hidden="true"></b-icon>
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>

      <b-row align-h="center" class="mb-3">
        <drawingSettings
          @toggleCanvasDrawingMode="toggleCanvasDrawingMode"
          @clearCanvas="clearDrawingCanvas"
        />
      </b-row>
      <b-row v-if="title" class="mb-3">
        <b-col>
          <label>{{ title }}</label>
        </b-col>
      </b-row>

      <b-row class="mb-3">
        <b-col>
          <customCanvas
            :topText="topText"
            :bottomText="bottomText"
            :img="img"
            :drawingSettings="drawingSettings"
            :fontSize="fontSize"
            @openTemplatesModal="openTemplatesModal"
            ref="meme"
          />
        </b-col>
      </b-row>

      <b-row class="justify-content-md-center mb-3">
        <b-col md="auto">
          <b-button
            variant="outline-primary"
            v-on:click="render_on_server"
            class="mr-3"
            >Render on server</b-button
          >
          <b-button variant="primary" v-on:click="saveOnServer" class="mr-3">
            Submit Meme
          </b-button>
          <b-button
            variant="outline-primary"
            v-on:click="download"
            class="mr-3"
          >
            Download
          </b-button>
          <b-button
            variant="outline-primary"
            v-on:click="saveDraft"
            class="mr-3"
            v-b-tooltip.hover
            :disabled="!$store.getters.isLoggedIn"
            :title="
              !$store.getters.isLoggedIn
                ? 'Log in to use this function'
                : 'Drawings on the meme will not be saved in the draft.'
            "
          >
            Save as Draft
          </b-button>
          <b-button
            :disabled="!$store.getters.isLoggedIn"
            variant="outline-primary"
            v-on:click="openDraftModal"
            :title="!$store.getters.isLoggedIn && 'Log in to use this function'"
          >
            Load from Drafts
          </b-button>
        </b-col>
      </b-row>
    </div>
    <div v-else>Choose your meme image source to start editing!</div>
    <b-row class="mb-3" align-h="center">
      <div>
        <customTemplate v-on:newTemplateSelected="changeTemplate" />
      </div>
    </b-row>
    <b-row class="mb-3" align-h="center">
      <templates v-on:newTemplateSelected="changeTemplate" />
    </b-row>

    <!-- draft popup -->
    <draft-modal ref="draftModal" v-on:selected="loadDraftIntoCanvas" />

    <!-- template popup -->
    <templates-modal
      ref="templatesModal"
      v-on:selected="apppendTemplateToCanvas"
    ></templates-modal>
  </b-container>
</template>

<script>
import { saveAs } from "file-saver";
import FormData from "form-data";
import router from "../../router/index.js";

import Templates from "./Templates.vue";
import CustomTemplate from "./CustomTemplate.vue";
import CustomCanvas from "./CustomCanvas.vue";
import DrawingSettings from "./DrawingSettings";
import DraftModal from "./Modals/DraftModal";
import TemplatesModal from "./Modals/TemplatesModal";

export default {
  name: "CreateMeme",
  components: {
    templates: Templates,
    customTemplate: CustomTemplate,
    customCanvas: CustomCanvas,
    drawingSettings: DrawingSettings,
    draftModal: DraftModal,
    templatesModal: TemplatesModal,
  },
  data() {
    return {
      topText: { text: "", offsetX: 0, offsetY: 30 },
      bottomText: { text: "", offsetX: 0, offsetY: -30 },
      fontSize: 100,
      img: "",
      pos: { x: 0, y: 0 },
      drawingSettings: { brushSize: "1px", color: "black", isErasing: false },
      title: "",
      baseStyles: {
        fontWeight: "800",
        color: "red",
      },
      overrideStyles: {
        color: "blue",
      },
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
      draftSaved: false,
    };
  },
  methods: {
    selectMemeTemplate(selectedIndex) {
      this.templateSelectionIndex = selectedIndex;
      this.$emit(
        "newTemplateSelected",
        //this.displayedImgFlipMemes[this.templateSelectionIndex].url,
        this.displayedMemes[this.templateSelectionIndex].url
      );
    },
    clearDrawingCanvas() {
      this.$refs.meme && this.$refs.meme.clearDrawingCanvas();
    },
    changeTemplate(newImageUrl) {
      this.img = newImageUrl;
      this.clearDrawingCanvas();
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
        data.append("visibility", this.visibility);
        data.append("file", blob); //, "file.png"
        data.append("title", this.title);
        let result = await fetch("http://localhost:3000/upload", {
          method: "POST",
          credentials: "include",
          body: data,
        });
        if (result.status === 200) {
          router.push({ name: "Home" }).catch((err) => {
            err;
          });
        }
      });
    },
    async saveDraft() {
      let draftModel = {
        topText: this.topText.text,
        topTextOffset: [this.topText.offsetX, this.topText.offsetY],
        bottomText: this.bottomText.text,
        bottomTextOffset: [this.bottomText.offsetX, this.bottomText.offsetY],
        memeSource: this.img,
        title: this.title,
      };
      let result = await fetch("http://localhost:3000/image-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(draftModel),
      });
      if (result.status === 204) {
        this.draftSaved = true;
        window.scrollTo(0, 0);
      }
    },
    apppendTemplateToCanvas(memeUrl) {
      this.$refs.meme.apppendTemplate(memeUrl);
    },
    async loadDraftIntoCanvas(draft) {
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
    },
    openDraftModal() {
      this.$refs.draftModal.openModal();
    },
    openTemplatesModal() {
      console.log("opening template");
      this.$refs.templatesModal.openModal();
    },
    changeFontSize(newFontSize) {
      this.fontSize = newFontSize;
    },

    async render_on_server() {
      var render_simple_meme_url = new URL(
          "http://localhost:3000/render-simple-meme"
        ),
        params = {
          template_image_url: this.img,
          top_text: this.topText.text,
          bottom_text: this.bottomText.text,
          top_x: this.topText.offsetX,
          top_y: this.topText.offsetY,
          bott_x: this.bottomText.offsetX,
          bott_y: this.bottomText.offsetY,
          font_size: this.fontSize,
        };
      render_simple_meme_url.search = new URLSearchParams(params).toString();
      let result = await fetch(render_simple_meme_url);
      const { path } = await result.json();
      this.changeTemplate(path);
    },
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





  

