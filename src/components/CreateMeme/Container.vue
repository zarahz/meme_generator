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
        </b-col>
        <b-col>
          <b-form-input
            :value="fontSize"
            @input="changeFontSize"
            number
            style="min-width: 60px"
            class="w-50"
            type="number"
            placeholder="100"
          />
        </b-col>
        <b-col>
          <label>Pick a color:</label>
          <v-input-colorpicker  
          v-model="fontColor"
          />
        </b-col>

        <b-col>
          <b-button-group>
            <b-button 
              title="isBold"
             v-on:click="setUnsetBold()"
            >
              <b-icon icon="type-bold" aria-hidden="true"></b-icon>
            </b-button>
            <b-button 
              title="Italic"
              v-on:click="setUnsetItalic()"
            >
              <b-icon icon="type-italic" aria-hidden="true"></b-icon>
            </b-button>
            <!--b-button title="Underline">
              <b-icon icon="type-underline" aria-hidden="true"></b-icon>
            </b-button>
            <b-button title="Strikethrough">
              <b-icon icon="type-strikethrough" aria-hidden="true"></b-icon>
            </b-button-->
          </b-button-group>
        </b-col>
      </b-row>
      <b-row class="mb-3" align-h="center">
        <b-container>
          <our-caption
            v-for="caption in captions"
            :key="caption.label"
            :label="caption.label"
            :text="caption.text"
            :deleteable="caption.deleteable"
            :offsetX="caption.offsetX"
            :offsetY="caption.offsetY"
            @delete="() => deleteCaption(caption)"
            @changeText="(text) => onChangeText(caption, text)"
            @changeOffset="(offsets) => onChangeOffset(caption, offsets)"
          />
          <b-row align-h="center">
            <b-button variant="outline-primary" @click="addMoreCaptions"
              >Add more captions</b-button
            >
          </b-row>
        </b-container>
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
            :captions="captions"
            :img="img"
            :drawingSettings="drawingSettings"
            :fontSize="fontSize"
            :font="font"
            :isItalic="isItalic"
            :isBold="isBold"
            :fontColor="fontColor"
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
import Caption from "./Caption";
import InputColorPicker from 'vue-native-color-picker';


export default {
  name: "CreateMeme",
  components: {
    templates: Templates,
    customTemplate: CustomTemplate,
    customCanvas: CustomCanvas,
    drawingSettings: DrawingSettings,
    draftModal: DraftModal,
    templatesModal: TemplatesModal,
    ourCaption: Caption,
    "v-input-colorpicker": InputColorPicker,
  },
  data() {
    return {
      captions: [
        {
          label: "Top Text",
          text: "Top Text",
          offsetX: 0,
          offsetY: 30,
          deleteable: false,
          fromBottom: false,
        },
  
  
        {
          label: "Bottom Text",
          text: "Bottom Text",
          offsetX: 0,
          offsetY: -30,
          deleteable: false,
          fromBottom: true,
        },
      ],
      //color: "#79c120",
      fontSize: 30,
      isItalic: "",
      isBold: "",
      fontColor: "#000000",
      incItalic: 0,
      incBold: 0, 
      font: "px Arial",
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
    clearDrawingCanvas() {
      this.$refs.meme && this.$refs.meme.clearDrawingCanvas();
    },
    setUnsetItalic() {
      this.isItalic = (this.incItalic % 2 == 0) ? "italic" :"";
      this.incItalic++;
      if(this.incItalic == 10) {
        this.incItalic == 0;
      }
    },
    setUnsetBold() {
      this.isBold = (this.incBold % 2 == 0) ? "bold" : "";
      this.incBold++;
      if(this.incBold == 10) {
        this.incBold == 0;
      }
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
        captions: this.captions,
        memeSource: this.$refs.meme.getMemeCanvasURI(),
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
      this.captions = draft.captions;
      this.img = draft.memeSource;
      this.$refs.meme.showTexts();
    },
    openDraftModal() {
      this.$refs.draftModal.openModal();
    },
    openTemplatesModal() {
      this.$refs.templatesModal.openModal();
    },
    onChangeOffset(caption, { offsetX, offsetY }) {
      caption.offsetX = offsetX;
      caption.offsetY = offsetY;

      this.$refs.meme.showTexts();
    },
    onChangeText(caption, text) {
      caption.text = text;

      this.$refs.meme.showTexts();
    },
    addMoreCaptions() {
      this.captions.push({
        label: `Text ${this.captions.length}`,
        text: `Text ${this.captions.length}`,
        offsetX: 0,
        offsetY: 30 + (this.captions.length - 1) * 45,
        fromBottom: false,
      });

      this.$refs.meme.showTexts();
    },
    deleteCaption(captionToRemove) {
      this.captions.splice(this.captions.indexOf(captionToRemove), 1);

      this.$refs.meme.showTexts();
    },
    changeFontSize(newFontSize) {
      this.fontSize = newFontSize;
    },
    changeFontColor(newFontColor) {
      this.fontColor = newFontColor;
    },
    async render_on_server() {
      let result = await fetch("http://localhost:3000/render-simple-meme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: this.img,
          captions: this.captions,
          font_size: this.fontSize,
        }),
      });
      const { path } = await result.json();
      console.log(path);
      this.changeTemplate(path);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>





  

