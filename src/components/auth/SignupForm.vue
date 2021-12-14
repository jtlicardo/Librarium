<template>
  <v-container class="login mx-auto d-flex flex-column justify-center">
    <base-dialog
      title="Signup error!"
      :text="signupError"
      color="red"
      :active="!!signupError"
      @close="handleError"
    ></base-dialog>
    <base-dialog
      title="Signing you up..."
      color="primary"
      loading
      :active="isLoading"
    ></base-dialog>
    <h1 class="text-center">SIGNUP</h1>
    <v-form ref="form">
      <div class="inputs">
        <v-text-field
          v-model.trim="fullname"
          label="Full name"
          type="text"
          required
          :rules="[rules.required]"
        ></v-text-field>
        <v-text-field
          v-model.trim="email"
          label="Email"
          hint="We won't send spam :)"
          type="email"
          required
          validate-on-blur
          :rules="[rules.required, rules.email]"
        ></v-text-field>
        <v-text-field
          v-model.trim="password"
          label="Password"
          type="password"
          hint="6 characters minimum"
          :rules="[rules.min]"
          validate-on-blur
          required
        ></v-text-field>
        <v-text-field
          v-model.trim="repeatedPassword"
          label="Repeat password"
          type="password"
          :rules="[rules.required, rules.checkRepeatedPassword]"
          validate-on-blur
          required
        ></v-text-field>
      </div>
    </v-form>
    <error-popup
      :active="validationError"
      :text="errorText"
      @close-dialog="validationError = false"
    />
    <v-btn
      color="yellow darken-1"
      class="mx-auto"
      @click="signup"
      :disabled="isLoading"
      :loading="isLoading"
    >
      SIGN UP
    </v-btn>
    <p class="text-center mt-10">
      Existing user?
      <a @click="changeCmp">Log in here.</a>
    </p>
    <v-snackbar content-class="text-center" v-model="snackbarActive" timeout="2000">
      Signup successful!
    </v-snackbar>
  </v-container>
</template>

<script>
import ErrorPopup from "@/components/ui/ErrorPopup.vue"
import BaseDialog from "@/components/ui/BaseDialog.vue"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"

export default {
  emits: ["change-cmp"],
  components: {
    ErrorPopup,
    BaseDialog,
  },
  data() {
    return {
      fullname: "",
      email: "",
      password: "",
      repeatedPassword: "",
      validationError: null,
      errorText: "",
      snackbarActive: false,
      isLoading: false,
      signupError: null,
      rules: {
        required: (value) => !!value || "Required",
        min: (value) => (value && value.length >= 6) || "6 characters minimum",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || "Invalid e-mail."
        },
        checkRepeatedPassword: (value) =>
          value === this.password || "Passwords don't match!",
      },
    }
  },
  methods: {
    changeCmp() {
      this.$emit("change-cmp")
    },
    validate() {
      if (this.fullname === "" || this.email === "" || this.password === "") {
        this.validationError = true
        this.errorText = "All fields are required!"
        return false
      }
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!pattern.test(this.email)) {
        this.validationError = true
        this.errorText = "Invalid email!"
        return false
      } else if (this.password.length < 6) {
        this.validationError = true
        this.errorText = "Password needs to have at least 6 characters!"
        return false
      } else if (this.password !== this.repeatedPassword) {
        this.validationError = true
        this.errorText = "Passwords don't match!"
        return false
      } else return true
    },
    signup() {
      if (!this.validate()) return
      this.isLoading = true
      setTimeout(() => {
        const auth = getAuth()
        createUserWithEmailAndPassword(auth, this.email, this.password)
          .then((userCredential) => {
            const user = userCredential.user
            console.log("Signup successful! ", user)
            this.snackbarActive = true
            this.$refs.form.reset()
          })
          .catch((error) => {
            console.log("Signup error! ", error)
            const errorMessage = error.message
            this.signupError = errorMessage
          })

        this.isLoading = false
      }, 1000)
    },
    handleError() {
      this.signupError = null
    },
  },
}
</script>

<style scoped>
.login {
  background-color: white;
  max-width: 570px;
  margin-top: 60px;
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
