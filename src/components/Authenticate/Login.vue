<template>
  <b-container class="justify-content-md-center" fluid>
    <form action="#" @submit.prevent="login" v-if="!$store.getters.isLoggedIn">
      <h3>Login</h3>

      <b-row align-h="center" class="form-group">
        <b-col cols="2">
          <label>Username or Email*:</label>
        </b-col>
        <b-col cols="auto">
          <b-form-input
            v-model="user.username"
            required
            class="form-control form-control-lg"
            type="text"
            v-on:input="resetError()"
          />
        </b-col>
      </b-row>

      <b-row align-h="center" class="form-group">
        <b-col cols="2">
          <label>Password*:</label>
        </b-col>
        <b-col cols="auto">
          <b-form-input
            required
            v-model="user.password"
            class="form-control form-control-lg"
            type="password"
            v-on:input="resetError()"
          />
        </b-col>
      </b-row>

      <b-row align-h="center">
        <b-button
          type="submit"
          variant="outline-primary"
          :disabled="this.error !== ''"
        >
          Login
        </b-button>
      </b-row>

      <b-row v-if="error" align-h="center" class="mb-3">
        <span>{{ error }}</span>
      </b-row>
    </form>
    <b-row align-h="center" v-else
      ><h3>You are already logged in, {{ $store.getters.user.username }}</h3>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      error: "",
    };
  },
  methods: {
    resetError() {
      this.error = "";
    },
    async login() {
      const loginResult = await this.$store.dispatch("login", this.user);
      if (loginResult !== true) {
        this.error = loginResult.error;
      } else {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
</style>