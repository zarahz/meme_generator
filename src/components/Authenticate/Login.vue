<template>
    <div class="vue-template">
        <form class="login" @submit.prevent="login">
            <h3>Sign In</h3>

            <div class="form-group">
                <label>Email address</label>
                <input type="email" class="form-control form-control-lg" />
            </div>

            <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control form-control-lg" />
            </div>

            <button type="submit" class="btn btn-dark btn-lg btn-block">Sign In</button>

            <p class="forgot-password text-right mt-2 mb-4">
                <router-link to="/forgot-password">Forgot password ?</router-link>
            </p>

            <!--div class="social-icons">
                <ul>
                    <li><a href="#"><i class="fa fa-google"></i></a></li>
                    <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                    <li><a href="#"><i class="fa fa-twitter"></i></a></li>
                </ul>
            </div-->

        </form>
    </div>
</template>


<script>
export default {
  name: "Login",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      errors: {},
    };
  },
  methods: {
      
    async checkUniqueness(fieldname, event) {
      let result = await fetch("http://localhost:3000/is-unique", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field: fieldname, value: event }),
      });
      if (result.status !== 200) {
        const { error } = await result.json();
        this.$set(this.errors, fieldname, error);
      } else {
        this.$delete(this.errors, fieldname);
      }
    },
    async login(evt) {
      evt.preventDefault();
      if (Object.keys(this.errors).length === 0) {
        //No problems, create new user!
        console.log(this.user);
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
          //TODO save token in local storage and get user by that!
          this.$delete(this.errors, "login");
        }
      }
    },
  },
};
</script>
