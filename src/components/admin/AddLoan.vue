<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">
        Loanee
        <small>Select which user is receiving the loan</small>
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">
        Book
        <small>Select which book you are lending</small>
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3">
        Copy
        <small>Select which copy you are lending</small>
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <choose-user @user-chosen="saveUser"></choose-user>

        <v-btn color="red white--text" class="mt-10">Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <choose-book @book-chosen="saveBook"></choose-book>

        <v-btn color="red white--text" class="mt-10">Cancel</v-btn>

        <v-btn text @click="e1 = 1" class="mt-10 mx-5">Go back</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

        <v-btn color="red white--text" class="mt-10">Cancel</v-btn>

        <v-btn text @click="e1 = 2" class="mt-10 mx-5">Go back</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import ChooseUser from "@/components/admin/add-loan/ChooseUser.vue"
import ChooseBook from "@/components/admin/add-loan/ChooseBook.vue"

export default {
  components: {
    ChooseUser,
    ChooseBook,
  },
  data() {
    return {
      e1: 1,
      user: {
        email: "",
        displayName: "",
      },
      book: {
        title: "",
        author: "",
        logoUrl: "",
        numOfPages: "",
      },
    }
  },
  methods: {
    saveUser(payload) {
      this.user.email = payload.email
      this.user.displayName = payload.fullname
      this.e1 = 2
    },
    saveBook(payload) {
      this.book.title = payload.title
      this.book.author = payload.author
      this.book.logoUrl = payload.logoUrl
      this.book.numOfPages = payload.numOfPages
      this.e1 = 3
    },
  },
}
</script>

<style></style>
