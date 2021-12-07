<template>
  <div>
    <v-img src="@/assets/logo.png" width="400px" class="mx-auto mt-10"></v-img>
    <transition>
      <login-form
        v-if="activeComponent === 'login-form'"
        @change-cmp="changeComponent"
      ></login-form>
      <signup-form v-else @change-cmp="changeComponent"></signup-form>
    </transition>
  </div>
</template>

<script>
import LoginForm from "@/components/auth/LoginForm.vue"
import SignupForm from "@/components/auth/SignupForm.vue"
export default {
  data() {
    return {
      activeComponent: "login-form",
    }
  },
  components: {
    LoginForm,
    SignupForm,
  },
  methods: {
    changeComponent() {
      if (this.activeComponent === "login-form") this.activeComponent = "signup-form"
      else this.activeComponent = "login-form"
    },
  },
}
</script>

<style></style>
