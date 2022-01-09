<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">Loanee</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">Book</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3">Copy</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1" class="text-center">
        <h4 class="text-center mb-10">Select which user is receiving the loan</h4>
        <choose-user @user-chosen="saveUser"></choose-user>

        <v-btn color="red white--text" class="mt-10" @click="cancelLoan">Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="2" class="text-center">
        <h4 class="text-center mb-10">Select which book you are lending</h4>
        <choose-book
          :userEmail="user.email"
          @book-chosen="saveBook"
          v-if="!isMobile"
        ></choose-book>
        <choose-book-mobile @book-chosen="saveBook" v-else></choose-book-mobile>
        <v-btn text @click="goBackToUser" class="mt-16 mx-5">Go back</v-btn>
        <v-btn color="red white--text" class="mt-16" @click="cancelLoan">Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3" class="text-center">
        <h4 class="text-center mb-10">Select which copy you are lending</h4>
        <choose-copy
          :title="book.title"
          :author="book.author"
          :logoUrl="book.logoUrl"
          :userEmail="user.email"
          @copy-chosen="saveCopy"
        ></choose-copy>
        <v-btn text @click="e1 = 2" class="mt-16 mx-5">Go back</v-btn>
        <v-btn color="red white--text" class="mt-16" @click="cancelLoan">Cancel</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import ChooseUser from "@/components/admin/add-loan/ChooseUser.vue"
import ChooseBook from "@/components/admin/add-loan/ChooseBook.vue"
import ChooseBookMobile from "@/components/admin/add-loan/ChooseBookMobile.vue"
import ChooseCopy from "@/components/admin/add-loan/ChooseCopy.vue"

export default {
  emits: ["loan-chosen"],
  components: {
    ChooseUser,
    ChooseBook,
    ChooseBookMobile,
    ChooseCopy,
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
      },
      copy: {
        inventoryNumber: "",
        status: "",
        userReservedCopy: false,
      },
    }
  },
  computed: {
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          return true
        default:
          return false
      }
    },
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
      this.e1 = 3
    },
    saveCopy(payload) {
      this.copy.inventoryNumber = payload.inventoryNumber
      this.copy.status = payload.status
      if (payload.userReservedCopy) {
        this.copy.userReservedCopy = payload.userReservedCopy
      }
      this.$emit("loan-chosen", { user: this.user, book: this.book, copy: this.copy })
    },
    cancelLoan() {
      this.$router.replace({ name: "Admin Loans" })
    },
    goBackToUser() {
      this.user.email = ""
      this.user.displayName = ""
      this.e1 = 1
    },
  },
}
</script>

<style scoped>
h4 {
  font-weight: 900;
}
</style>
