<template>
    <div class="vue-template">
        <form action="#" @submit.prevent="loginUser">
            <h3>Sign In</h3>

            <b-col cols="2">
                <label>Username*:</label>
              </b-col>
              <b-col cols="auto">
                <b-form-input
                  v-model="user.username"
                  required
                  class="form-control form-control-lg"
                  type="text"
                  v-on:input="checkUniqueness('username', $event)"
                />
            </b-col>
            <b-row v-if="errors.username" align-h="center" class="mb-3">
              <span>{{ errors.username }}</span>
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
                />
              </b-col>
            </b-row>

            <b-row align-h="center">
                <b-button
                  type="submit"
                  variant="outline-primary"
                  :disabled="Object.keys(this.errors).length > 0"
                >
                  Login
                </b-button>
              </b-row>

            <p class="forgot-password text-right mt-2 mb-4">
                <router-link to="/forgot-password">Forgot password ?</router-link>
            </p>

            <div class="social-icons">
                <ul>
                    <li><a href="#"><i class="fa fa-google"></i></a></li>
                    <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                    <li><a href="#"><i class="fa fa-twitter"></i></a></li>
                </ul>
            </div>

        </form>
    </div>
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
      errors: {},
    };
  },
  methods: {
    async loginUser() {
        try {
          let result = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.user),
          });
          if (result.status !== 200) {
            const { error } = await result.json();
            this.$set(this.errors, "login", error);
        } else {
          const { token } = await result.json();
          console.log(token);
          localStorage.setItem('user-token',token)
          this.$delete(this.errors, "login");
          this.$router.push('/')
        }
        } catch (err) {
+          console.log(err.response);
        }
      }
  }
};
</script>

<style scoped>
</style>