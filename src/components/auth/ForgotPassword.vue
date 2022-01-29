<template>
  <v-container class="login mx-auto d-flex flex-column justify-center">
    <h2 class="text-center">RESET PASSWORD</h2>
    <p class="text-center mt-5">
      We will send you an email in order to reset your password
    </p>
    <div class="inputs">
      <v-text-field
        v-model.trim="email"
        label="Enter your email"
        type="email"
        required
        :rules="[rules.required, rules.email]"
        validate-on-blur
      ></v-text-field>
    </div>
    <v-btn color="yellow darken-1" class="mx-auto" @click="send">SEND</v-btn>
    <p class="text-center mt-10">
      <a @click="changeCmp('login')">Back to login</a>
    </p>
    <error-popup
      :active="validationError"
      text="Please enter a valid email!"
      @close-dialog="validationError = false"
    />
    <base-dialog
      title="Sending email..."
      color="primary"
      loading
      :active="isLoading"
    ></base-dialog>
  </v-container>
</template>

<script>
import ErrorPopup from "@/components/ui/ErrorPopup.vue"
import BaseDialog from "@/components/ui/BaseDialog.vue"
import { getAuth, sendPasswordResetEmail } from "@/firebase.js"
export default {
  components: {
    ErrorPopup,
    BaseDialog,
  },
  data() {
    return {
      email: "",
      validationError: null,
      isLoading: false,
      rules: {
        required: (value) => !!value || "Required",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || "Invalid e-mail."
        },
      },
    }
  },
  methods: {
    changeCmp(payload) {
      this.$emit("change-cmp", payload)
    },
    validate() {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!pattern.test(this.email)) {
        this.validationError = true
        return false
      } else if (this.email === "") {
        this.validationError = true
        return false
      } else return true
    },
    send() {
      if (!this.validate()) return
      this.isLoading = true
      setTimeout(() => {
        const auth = getAuth()
        sendPasswordResetEmail(auth, this.email)
          .then(() => {
            this.email = ""
            this.$store.dispatch("displaySnackbar", {
              text: "Reset password email sent!",
              isActive: true,
            })
            this.changeCmp("login")
          })
          .catch((error) => {
            const errorMessage = error.message
            console.log("Error while sending pw reset email! ", errorMessage)
            this.$store.dispatch("displayBaseDialog", {
              text: errorMessage,
              title: "Error!",
              color: "red",
              loading: false,
              active: true,
            })
          })
        this.isLoading = false
      }, 1000)
    },
    handleError() {
      this.errorExists = false
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
