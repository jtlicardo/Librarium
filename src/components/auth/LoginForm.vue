<template>
  <v-container class="login mx-auto d-flex flex-column justify-center">
    <base-dialog
      title="Login error!"
      :text="loginError"
      color="red"
      :active="!!loginError"
      @close="handleError"
    ></base-dialog>
    <base-dialog
      title="Logging you in..."
      color="primary"
      loading
      :active="isLoading"
    ></base-dialog>
    <h1 class="text-center">LOGIN</h1>
    <div class="inputs">
      <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        required
      ></v-text-field>
    </div>
    <v-btn color="yellow darken-1" class="mx-auto" @click="login">LOG IN</v-btn>
    <p class="text-center mt-10">
      New user?
      <a @click="changeCmp">Sign up here</a>
      or:
    </p>
  </v-container>
</template>

<script>
import ErrorPopup from "@/components/ui/ErrorPopup.vue"
import BaseDialog from "@/components/ui/BaseDialog.vue"
export default {
  emits: ["change-cmp"],
  components: {
    ErrorPopup,
    BaseDialog,
  },
  data() {
    return {
      email: "",
      password: "",
      isLoading: false,
      loginError: null,
    }
  },
  methods: {
    changeCmp() {
      this.$emit("change-cmp")
    },
    async login() {
      this.isLoading = true
      try {
        await this.$store.dispatch("login", {
          email: this.email,
          password: this.password,
        })
        this.$router.replace("/ubooks")
      } catch (error) {
        this.loginError = error.message || "Login error!"
      }
      this.isLoading = false
    },
    handleError() {
      this.loginError = null
    },
  },
}
</script>

<style scoped>
.login {
  background-color: white;
  max-width: 570px;
  margin-top: 100px;
  border-radius: 20px;
  padding: 20px 50px 30px;
}

.inputs {
  padding: 5% 5%;
}

p,
p a {
  color: gray;
}

p a {
  text-decoration: underline;
  font-weight: 500;
}
</style>
