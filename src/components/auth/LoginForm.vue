<template>
  <v-container class="login mx-auto d-flex flex-column justify-center">
    <h1 class="text-center">LOGIN</h1>
    <div class="inputs">
      <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        required
      ></v-text-field>
      <p class="text-center"><a @click="changeCmp('forgot')">Forgot password?</a></p>
    </div>
    <v-btn color="yellow darken-1" class="mx-auto" @click="login">LOG IN</v-btn>
    <p class="text-center mt-10">
      New user?
      <a @click="changeCmp('signup')">Sign up here</a>
      or:
    </p>
    <v-btn @click="googleAuth" class="mx-auto mt-5 py-5" color="white">
      <v-img src="@/assets/google.png" max-width="20px"></v-img>
      <span class="googlelogin">Log in with Google</span>
    </v-btn>
    <div id="overlay"></div>
  </v-container>
</template>

<script>
import ErrorPopup from "@/components/ui/ErrorPopup.vue"
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth"
import { db, collection, addDoc, getDocs, query, where } from "@/firebase.js"

export default {
  emits: ["change-cmp"],
  components: {
    ErrorPopup,
  },
  data() {
    return {
      email: "",
      password: "",
    }
  },
  methods: {
    changeCmp(payload) {
      this.$emit("change-cmp", payload)
    },
    timeout(miliseconds) {
      return new Promise((resolve) => setTimeout(resolve, miliseconds))
    },
    animation() {
      return new Promise(async (resolve) => {
        document.querySelector("#overlay").classList.toggle("overlay")
        document.querySelector("#overlay").classList.toggle("fadeout")
        await this.timeout(1500)
        resolve()
      })
    },
    async login() {
      this.$store.dispatch("displayLoadingDialog", {
        active: true,
        title: "Logging you in...",
      })
      try {
        const auth = getAuth()
        let userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        )
        const user = userCredential.user
        await this.animation()
        this.$store.dispatch("displaySnackbar", {
          text: "Login successful!",
          isActive: true,
        })
        const userIsAdmin = localStorage.getItem("userIsAdmin")
        if (userIsAdmin === "true") {
          this.$router.replace({ name: "Admin Books" })
        } else if (userIsAdmin === "false") {
          this.$router.replace({ name: "User Books" })
        }
      } catch (e) {
        console.log("Login error!", e)
        this.$store.dispatch("displayBaseDialog", {
          text: e.toString(),
          title: "Login error!",
          color: "red",
          loading: false,
          active: true,
        })
      }
      this.$store.dispatch("displayLoadingDialog", {
        active: false,
        title: "",
      })
    },
    async googleAuth() {
      const provider = new GoogleAuthProvider()
      const auth = getAuth()
      if (this.mobile) {
        signInWithRedirect(auth, provider)
      } else {
        try {
          let result = await signInWithPopup(auth, provider)
          this.$store.dispatch("displayLoadingDialog", {
            active: true,
            title: "Logging you in...",
          })
          const user = result.user
          let check = await this.checkIfUserExists(user.uid)
          if (!check) {
            this.addUserToCollection(user.uid, user.displayName, user.email)
          }
          const userIsAdmin = localStorage.getItem("userIsAdmin")
          await this.animation()
          if (userIsAdmin === "true") {
            this.$router.replace("/adminbooks")
          } else if (userIsAdmin === "false") {
            this.$router.replace({ name: "User Books" })
          }
          this.$store.dispatch("displaySnackbar", {
            text: `Logged in as ${user.email}`,
            isActive: true,
          })
        } catch (e) {
          console.log("Google login error: ", e)
        }
        this.$store.dispatch("displayLoadingDialog", {
          active: false,
          title: "",
        })
      }
    },
    async checkIfUserExists(userUid) {
      const users = collection(db, "users")
      const q = query(users, where("uid", "==", userUid))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty === true) return false
      else {
        return true
      }
    },
    async addUserToCollection(userId, displayName, email) {
      try {
        const docRef = await addDoc(collection(db, "users"), {
          uid: userId,
          fullname: displayName,
          email: email,
          isAdmin: false,
          loans: [],
          reservations: [],
        })
      } catch (e) {
        console.error("Error adding user to collection: ", e)
      }
    },
    async redirectResult() {
      try {
        const auth = getAuth()
        let result = await getRedirectResult(auth)
        const user = result.user
        if (user) {
          this.$store.dispatch("displayLoadingDialog", {
            active: true,
            title: "Logging you in...",
          })
          console.log("Google mobile login successful!", user)
          let result = await this.checkIfUserExists(user.uid)
          if (!result) {
            this.addUserToCollection(user.uid, user.displayName, user.email)
          }
          const userIsAdmin = localStorage.getItem("userIsAdmin")
          await this.animation()
          if (userIsAdmin === "true") {
            this.$router.replace("/adminbooks")
          } else if (userIsAdmin === "false") {
            this.$router.replace({ name: "User Books" })
          }
          this.$store.dispatch("displaySnackbar", {
            text: `Logged in as ${user.email}`,
            isActive: true,
          })
        }
      } catch (e) {
        const email = e.email
        if (email) console.log("Google mobile login error: ", e)
      }
      this.$store.dispatch("displayLoadingDialog", {
        active: false,
        title: "",
      })
    },
  },
  computed: {
    mobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          return true
        default:
          return false
      }
    },
  },
  async created() {
    await this.redirectResult()
  },
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Zen+Kaku+Gothic+Antique:wght@300;400;500;700;900&display=swap");

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

.googlelogin {
  margin-left: 20px;
  letter-spacing: 0px;
  color: grey;
  text-transform: none;
  font-family: "Roboto", sans-serif;
}

.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
}

.fadeout {
  background-color: white;
  transition: all 1.5s;
}
</style>
