<template>
  <v-row justify="center">
    <v-dialog v-model="active" persistent width="400px" v-if="!googleAuth">
      <v-card>
        <v-card-title>
          <h2 class="mx-auto">Delete account</h2>
        </v-card-title>
        <v-card-subtitle>
          <h3 class="text-center mt-10">
            Please confirm by entering
            <br />
            your email and password
          </h3>
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
            label="Email"
            type="email"
            required
            v-model.trim="email"
          ></v-text-field>
          <v-text-field
            label="Password"
            type="password"
            required
            v-model.trim="password"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray darken-1" class="px-4 mx-auto" text @click="closeDialog">
            Close
          </v-btn>
          <v-btn color="red white--text" class="px-4 mx-auto" @click="deleteAccount">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="active" persistent width="400px" v-else>
      <v-card>
        <v-card-title>
          <h2 class="mx-auto">Delete account</h2>
        </v-card-title>
        <v-card-subtitle>
          <h3 class="text-center mt-10">
            Please confirm your action by
            <br />
            logging in again with your account
          </h3>
        </v-card-subtitle>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-btn color="gray darken-1" class="px-4 mx-auto" text @click="closeDialog">
            Close
          </v-btn>
          <v-btn @click="deleteAccount" class="mx-auto px-4" color="red white--text">
            <span class="googlelogin">Confirm</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {
  getAuth,
  reauthenticateWithCredential,
  deleteUser,
  deleteDoc,
  doc,
  db,
} from "@/firebase.js"
import { EmailAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
export default {
  props: ["active", "docId"],
  emits: ["close-dialog"],
  data() {
    return {
      email: "",
      password: "",
      user: null,
    }
  },
  created() {
    this.getUserDetails()
  },
  computed: {
    googleAuth() {
      if (this.user && this.user.providerData[0].providerId === "google.com") return true
      else return false
    },
  },
  methods: {
    getUserDetails() {
      const auth = getAuth()
      this.user = auth.currentUser
    },
    closeDialog() {
      this.email = ""
      this.password = ""
      this.$emit("close-dialog")
    },
    validate() {
      const userEmail = localStorage.getItem("userEmail")
      if (this.email === "") {
        this.$store.dispatch("displayErrorPopup", {
          isActive: true,
          text: "Please enter your email!",
        })
        return false
      } else if (this.email !== userEmail) {
        this.$store.dispatch("displayErrorPopup", {
          isActive: true,
          text: "Email address is incorrect!",
        })
        return false
      } else if (this.password === "") {
        this.$store.dispatch("displayErrorPopup", {
          isActive: true,
          text: "Please enter your password!",
        })
        return false
      } else return true
    },
    async deleteAccount() {
      const auth = getAuth()
      const user = auth.currentUser
      if (this.googleAuth) {
        try {
          const provider = new GoogleAuthProvider()
          const result = await signInWithPopup(auth, provider)
          const authCredential = GoogleAuthProvider.credentialFromResult(result)
          await reauthenticateWithCredential(user, authCredential)
          await deleteDoc(doc(db, "users", this.docId))
          console.log("User deleted from collection!")
          await deleteUser(user)
          console.log("User deleted (auth)!")
          this.$store.dispatch("setUser", {
            uid: null,
            email: null,
            fullname: null,
            isAdmin: null,
            backButtonActive: null,
          })
          this.$router.replace("/auth")
          this.$store.dispatch("displaySnackbar", {
            text: "Account deleted!",
            isActive: true,
          })
        } catch (e) {
          console.log("Error: ", e)
          this.$store.dispatch("displayBaseDialog", {
            text: e.toString(),
            title: "Error! Please try again later.",
            color: "red",
            loading: false,
            active: true,
          })
        }
      } else {
        try {
          if (!this.validate()) return
          const authCredential = EmailAuthProvider.credential(this.email, this.password)
          await reauthenticateWithCredential(user, authCredential)
          await deleteDoc(doc(db, "users", this.docId))
          console.log("User deleted from collection!")
          await deleteUser(user)
          console.log("User deleted (auth)!")
          this.$store.dispatch("setUser", {
            uid: null,
            email: null,
            fullname: null,
            isAdmin: null,
            backButtonActive: null,
          })
          this.$router.replace("/auth")
          this.$store.dispatch("displaySnackbar", {
            text: "Account deleted!",
            isActive: true,
          })
        } catch (e) {
          console.log("Error: ", e)
          this.$store.dispatch("displayBaseDialog", {
            text: e.toString(),
            title: "Error! Please try again later.",
            color: "red",
            loading: false,
            active: true,
          })
        }
      }
    },
  },
}
</script>

<style scoped></style>
