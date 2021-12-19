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
  </v-container>
</template>

<script>
import ErrorPopup from "@/components/ui/ErrorPopup.vue"
import BaseDialog from "@/components/ui/BaseDialog.vue"
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
    changeCmp(payload) {
      this.$emit("change-cmp", payload)
    },
    login() {
      this.isLoading = true
      setTimeout(() => {
        const auth = getAuth()
        signInWithEmailAndPassword(auth, this.email, this.password)
          .then((userCredential) => {
            const user = userCredential.user
            console.log("Login successful! ", user)
            this.$store.dispatch("displaySnackbar", {
              text: "Login successful!",
              isActive: true,
            })
            this.$router.replace("/ubooks")
          })
          .catch((error) => {
            console.log("Login error! ", error)
            const errorMessage = error.message
            this.loginError = errorMessage
          })
        this.isLoading = false
      }, 1000)
    },
    googleAuth() {
      const provider = new GoogleAuthProvider()
      const auth = getAuth()
      if (this.mobile) {
        signInWithRedirect(auth, provider)
      } else {
        signInWithPopup(auth, provider)
          .then((result) => {
            const user = result.user
            console.log("Successful Google login! ", user)
            this.$store
              .dispatch("displaySnackbar", {
                text: `Logged in as ${user.email}`,
                isActive: true,
              })
              .then(() => {
                this.checkIfUserExists(user.uid)
                  .then((result) => {
                    if (!result) {
                      this.addUserToCollection(user.uid, user.displayName, user.email)
                    }
                    const userIsAdmin = localStorage.getItem("userIsAdmin")
                    console.log("Login - user is admin?", userIsAdmin)
                    if (userIsAdmin === "true") {
                      this.$router.replace("/adminbooks")
                      console.log("User is admin !!!")
                    } else if (userIsAdmin === "false") {
                      this.$router.replace("/ubooks")
                      console.log("User is NOT admin !!!")
                    }
                  })
                  .catch((error) => {
                    console.log(error)
                  })
              })
          })
          .catch((error) => {
            const errorMessage = error.message
            const email = error.email
            const credential = GoogleAuthProvider.credentialFromError(error)
            console.log("Google login error!", email, errorMessage, credential)
          })
      }
    },
    handleError() {
      this.loginError = null
    },
    async checkIfUserExists(userUid) {
      const users = collection(db, "users")
      const q = query(users, where("uid", "==", userUid))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty === true) return false
      else return true
    },
    async addUserToCollection(userId, displayName, email) {
      try {
        const docRef = await addDoc(collection(db, "users"), {
          uid: userId,
          fullname: displayName,
          email: email,
          isAdmin: false,
        })
        console.log("User successfully added to collection!")
        console.log("Document written with ID: ", docRef.id)
      } catch (e) {
        console.error("Error adding user to collection: ", e)
      }
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
  created() {
    const auth = getAuth()
    getRedirectResult(auth)
      .then((result) => {
        const user = result.user
        if (user) {
          this.isLoading = true
          console.log("Google mobile login successful!", user)
          this.addUserToCollection(user.uid, user.displayName, user.email)
          setTimeout(() => {
            this.$store.dispatch("displaySnackbar", {
              text: `Logged in as ${user.email}`,
              isActive: true,
            })
            this.$router.replace("/ubooks")
            this.isLoading = false
          }, 2000)
        }
      })
      .catch((error) => {
        const email = error.email
        const errorMessage = error.message
        if (email) console.log("Google mobile login error: ", errorMessage)
      })
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
</style>
