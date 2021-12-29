<template>
  <v-row justify="center">
    <v-dialog v-model="active" persistent width="400px">
      <v-card>
        <v-card-title>
          <h2 class="mx-auto">Send request</h2>
        </v-card-title>
        <v-card-subtitle>
          <h3 class="text-center mt-10">
            Please enter the title
            <br />
            and the author of the book
          </h3>
        </v-card-subtitle>
        <v-card-text>
          <v-text-field label="Title" required v-model.trim="title"></v-text-field>
          <v-text-field label="Author" required v-model.trim="author"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray darken-1" class="px-4 mx-auto" text @click="closeDialog">
            Close
          </v-btn>
          <v-btn color="yellow darken-1" class="px-4 mx-auto" @click="sendRequest">
            Send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { db, collection, addDoc } from "@/firebase.js"

export default {
  props: ["active"],
  data() {
    return {
      title: "",
      author: "",
    }
  },
  methods: {
    closeDialog() {
      this.title = ""
      this.author = ""
      this.$emit("close-dialog")
    },
    validate() {
      if (this.title === "") {
        this.$store.dispatch("displayErrorPopup", {
          isActive: true,
          text: "Please enter the title!",
        })
        return false
      } else if (this.author === "") {
        this.$store.dispatch("displayErrorPopup", {
          isActive: true,
          text: "Please enter the author!",
        })
        return false
      } else return true
    },
    async sendRequest() {
      if (!this.validate) return
      try {
        const docRef = await addDoc(collection(db, "bookRequests"), {
          title: this.title,
          author: this.author,
        })
        this.$store.dispatch("displaySnackbar", {
          text: "Request sent!",
          isActive: true,
        })
        console.log("Document written with ID: ", docRef.id)
        this.closeDialog()
      } catch (e) {
        console.log(e)
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
