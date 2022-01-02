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

        <v-btn color="yellow darken-1" @click="e1 = 2">Continue</v-btn>

        <v-btn text>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

        <v-btn color="yellow darken-1" @click="e1 = 3">Continue</v-btn>

        <v-btn text>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

        <v-btn color="yellow darken-1" @click="e1 = 1">Continue</v-btn>

        <v-btn text>Cancel</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import ChooseUser from "@/components/admin/add-loan/ChooseUser.vue"
import FilteredBooks from "@/components/FilteredBooks.vue"

export default {
  components: {
    ChooseUser,
    FilteredBooks,
  },
  data() {
    return {
      e1: 1,
      userEmail: "",
      userDisplayName: "",
    }
  },
  methods: {
    saveUser(payload) {
      this.userEmail = payload.email
      this.userDisplayName = payload.fullname
      console.log(this.userEmail, this.userDisplayName)
      this.e1 = 2
    },
  },
}
</script>

<style></style>
