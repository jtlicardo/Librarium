<template>
  <v-row justify="center">
    <v-dialog v-model="active" persistent width="400px">
      <v-card>
        <v-card-title>
          <h2 class="mx-auto">Delete account</h2>
        </v-card-title>
        <v-card-subtitle>
          <h3 class="text-center mt-10">
            Please enter your
            <br />
            email and password
          </h3>
        </v-card-subtitle>
        <v-card-text>
          <v-text-field label="Email" required v-model.trim="email"></v-text-field>
          <v-text-field label="Password" required v-model.trim="password"></v-text-field>
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
import { EmailAuthProvider } from "firebase/auth"
export default {
  props: ["active", "docId"],
  emits: ["close-dialog"],
  data() {
    return {
      email: "",
      password: "",
    }
  },
  methods: {
    closeDialog() {
      this.email = ""
      this.password = ""
      this.$emit("close-dialog")
    },
    validate() {
      if (this.email === "") {
        this.$store.dispatch("displayErrorPopup", {
          isActive: true,
          text: "Please enter your email!",
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
      if (!this.validate()) return
      try {
        await deleteDoc(doc(db, "users", this.docId))
        console.log("User deleted from collection!")
        const auth = getAuth()
        const user = auth.currentUser
        const authCredential = EmailAuthProvider.credential(this.email, this.password)
        await reauthenticateWithCredential(user, authCredential)
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
    },
  },
}
</script>

<style scoped></style>
