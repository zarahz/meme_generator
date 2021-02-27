<template>
  <b-modal
    v-model="showModal"
    ref="templatesModal"
    id="templatesModal"
    size="lg"
    scrollable
    title="Pick a Template"
    @ok="selected"
  >
    <b-row v-if="this.template.name"
      >selected Template: {{ this.template.name }}</b-row
    >
    <b-row>
      <templates v-on:newTemplateSelected="setSelectedTemplate"></templates>
    </b-row>
  </b-modal>
</template>

<script>
import Templates from "../Templates/Templates.vue";
export default {
  components: { Templates },
  name: "TemplatesModal",
  data() {
    return {
      template: { url: "", name: "" },
      showModal: false,
    };
  },
  methods: {
    setSelectedTemplate(template, name) {
      this.template.url = template;
      this.template.name = name;
    },
    async selected() {
      if (!this.template) return;
      this.$emit("selected", this.template.url);
    },
    openModal() {
      this.showModal = true;
    },
  },
};
</script>

<style scoped>
</style>