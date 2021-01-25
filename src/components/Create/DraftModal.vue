<template>
  <b-modal
    ref="draftModal"
    id="draftModal"
    scrollable
    title="Pick a Draft"
    @ok="selected"
  >
    <b-spinner label="Spinning" v-if="loading"></b-spinner>
    <b-row v-if="allDrafts.length === 0" class="ml-2"
      >No drafts are available.</b-row
    >
    <b-form-group>
      <div v-for="draft in allDrafts" v-bind:key="draft._id">
        <b-form-radio v-model="selectedDraft" :value="draft">
          <b-col class="ml-2">
            <b-row v-if="draft.topText"> Top Text: {{ draft.topText }} </b-row>
            <b-row v-if="draft.bottomText">
              Top Text: {{ draft.bottomText }}
            </b-row>
            <b-row> Image source: {{ draft.memeSource }} </b-row>
          </b-col>
          <hr />
        </b-form-radio>
      </div>
    </b-form-group>
  </b-modal>
</template>

<script>
export default {
  name: "DraftModal",
  data() {
    return {
      allDrafts: [],
      selectedDraft: {},
      loading: true,
      showDraftModal: false,
    };
  },
  methods: {
    async getAllDrafts() {
      this.loading = true;
      let result = await fetch("http://localhost:3000/image-drafts", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      if (result.status === 200) {
        const drafts = await result.json();
        this.allDrafts = drafts;
      }
      this.loading = false;
      this.$refs["draftModal"].show();
    },
    async selected() {
      if (!this.selectedDraft) return;
      this.$emit("selected", this.selectedDraft);
    },
    openModal() {
      this.getAllDrafts();
      this.showDraftModal = true;
    },
  },
};
</script>

<style scoped>
</style>