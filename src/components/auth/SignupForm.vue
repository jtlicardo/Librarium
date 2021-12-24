<template>
  <v-container class="login mx-auto d-flex flex-column justify-center">
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
      class="mx-auto signupbutton"
      @click="signup"
      :disabled="isLoading"
      :loading="isLoading"
    >
      SIGN UP
    </v-btn>
    <p class="text-center mt-10 paragraph">
      Existing user?
      <a @click="changeCmp('login')">Log in here.</a>
    </p>
  </v-container>
</template>

<script>
import ErrorPopup from "@/components/ui/ErrorPopup.vue"
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { db, collection, addDoc } from "@/firebase.js"

export default {
  emits: ["change-cmp"],
  components: {
    ErrorPopup,
  },
  data() {
    return {
      fullname: "",
      email: "",
      password: "",
      repeatedPassword: "",
      validationError: null,
      errorText: "",
      isLoading: false,
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
    changeCmp(payload) {
      this.$emit("change-cmp", payload)
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
    async addUserToCollection(userId) {
      try {
        const docRef = await addDoc(collection(db, "users"), {
          uid: userId,
          fullname: this.fullname,
          email: this.email,
          isAdmin: false,
        })
        console.log("User successfully added to collection!")
        console.log("Document written with ID: ", docRef.id)
      } catch (e) {
        console.error("Error adding user to collection: ", e)
      }
    },
    animation() {
      return new Promise(async (resolve) => {
        document.querySelector("h1").classList.toggle("fadeout")
        document.querySelector(".inputs").classList.toggle("fadeout")
        document.querySelector(".signupbutton").classList.toggle("fadeout")
        document.querySelector(".paragraph").classList.toggle("fadeout")
        await this.timeout(1500)
        document.querySelector(".login").classList.toggle("scale")
        await this.timeout(2000)
        resolve()
      })
    },
    timeout(miliseconds) {
      return new Promise((resolve) => setTimeout(resolve, miliseconds))
    },
    async signup() {
      if (!this.validate()) return
      this.isLoading = true
      this.$store.dispatch("displayLoadingDialog", {
        active: true,
        title: "Signing you up...",
      })
      try {
        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        )
        const user = userCredential.user
        console.log("Signup successful! ", user)
        await updateProfile(auth.currentUser, {
          displayName: this.fullname,
        })
        console.log("Signed up with display name: ", auth.currentUser.displayName)
        this.addUserToCollection(user.uid)
        await this.animation()
        this.$router.replace("/ubooks")
        this.$store.dispatch("displaySnackbar", {
          text: "Signup successful!",
          isActive: true,
        })
        this.$store.dispatch("displayLoadingDialog", {
          active: false,
          title: "",
        })
        await this.timeout(2100)
        this.$store.dispatch("displaySnackbar", {
          text: `Logged in as ${user.email}`,
          isActive: true,
        })
      } catch (error) {
        const errorMessage = error.message
        console.log("Signup error! ", errorMessage)
        this.$store.dispatch("displayLoadingDialog", {
          active: false,
          title: "",
        })
        this.$store.dispatch("displayBaseDialog", {
          text: errorMessage,
          title: "Signup error!",
          color: "red",
          loading: false,
          active: true,
        })
      }
      this.isLoading = false
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

.fadeout {
  opacity: 0;
  transition: all 1.5s;
}

.scale {
  transform: scale(4);
  transition: all 2s ease-out;
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
