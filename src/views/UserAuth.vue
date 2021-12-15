<template>
  <div>
    <v-img src="@/assets/logo.png" :max-width="imageWidth" class="mx-auto mt-10"></v-img>
    <transition name="form" mode="out-in">
      <login-form
        v-if="activeComponent === 'login-form'"
        @change-cmp="changeComponent"
      ></login-form>
      <forgot-password
        v-else-if="activeComponent === 'forgot-password'"
        @change-cmp="changeComponent"
      ></forgot-password>
      <signup-form v-else @change-cmp="changeComponent"></signup-form>
    </transition>
  </div>
</template>

<script>
import LoginForm from "@/components/auth/LoginForm.vue"
import SignupForm from "@/components/auth/SignupForm.vue"
import ForgotPassword from "@/components/auth/ForgotPassword.vue"
export default {
  data() {
    return {
      activeComponent: "login-form",
    }
  },
  components: {
    LoginForm,
    SignupForm,
    ForgotPassword,
  },
  computed: {
    imageWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
        case "md":
        case "lg":
          return "225px"
        default:
          return "300px"
      }
    },
  },
  methods: {
    changeComponent(payload) {
      if (payload === "signup") this.activeComponent = "signup-form"
      else if (payload === "forgot") this.activeComponent = "forgot-password"
      else this.activeComponent = "login-form"
    },
  },
}
</script>

<style scoped>
.form-enter-active,
.form-leave-active {
  transition: opacity 0.3s ease;
}

.form-enter,
.form-leave-to {
  opacity: 0;
}
</style>
