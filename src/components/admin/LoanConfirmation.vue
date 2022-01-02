<template>
  <div>
    <h3 class="mb-10 text-center">Please check loan details and confirm</h3>
    <v-card max-width="500px" class="mb-5 mx-auto">
      <div class="d-flex flex-no-wrap justify-space-between mt-3">
        <div>
          <v-card-title
            class="text-subtitle-1 text-sm-h5 text-md-subtitle-1 text-lg-h6 word-break"
          >
            {{ bookTitle }}
          </v-card-title>
          <v-card-subtitle>
            <p>by {{ bookAuthor }}</p>
            <p>Inventory number: {{ copyInvNumber }}</p>
          </v-card-subtitle>
        </div>
        <v-avatar class="ma-3" :size="cardSize" tile>
          <v-img :src="bookLogoUrl" contain></v-img>
        </v-avatar>
      </div>
    </v-card>
    <v-data-table
      :headers="headers"
      :items="userData"
      hide-default-footer
      class="elevation-1 mx-auto"
    ></v-data-table>
    <v-container class="text-center mt-12">
      <v-btn color="red white--text" class="mx-2">Cancel</v-btn>
      <v-btn color="yellow darken-1" class="mx-2">Confirm</v-btn>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ["user", "book", "copy"],
  data() {
    return {
      headers: [
        {
          text: "FULL NAME",
          sortable: false,
          value: "displayName",
          align: "center",
        },
        {
          text: "EMAIL",
          value: "email",
          sortable: false,
          align: "center",
        },
      ],
    }
  },
  computed: {
    userData() {
      let user = []
      user.push(this.user)
      return user
    },
    bookTitle() {
      return this.book.title
    },
    bookAuthor() {
      return this.book.author
    },
    bookLogoUrl() {
      return this.book.logoUrl
    },
    copyInvNumber() {
      return this.copy.inventoryNumber
    },
    cardSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          return 100
        default:
          return 125
      }
    },
  },
}
</script>

<style scoped>
.v-data-table {
  max-width: 600px !important;
}
</style>
