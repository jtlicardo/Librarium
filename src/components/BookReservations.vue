<template>
  <v-data-table
    :headers="headers"
    :items="reservations"
    hide-default-footer
    class="elevation-1 grey lighten-4"
  >
    <template v-slot:[`item.cancel`]>
      <v-btn class="mx-2" color="red darken-1" fab x-small elevation="1">
        <v-icon color="white" @click="openDialog">mdi-trash-can-outline</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "BOOK TITLE",
          sortable: false,
          value: "bookTitle",
        },
        { text: "AUTHOR", value: "author", sortable: false },
        { text: "INVENTORY NUMBER", value: "inventoryNumber", sortable: false },
        { text: "START DATE", value: "startDate", sortable: false },
        { text: "END DATE", value: "endDate", sortable: false },
        { text: "CANCEL", value: "cancel", sortable: false },
      ],
      reservations: [
        {
          bookTitle: "Crime and Punishment",
          author: "Fyodor Dostoevsky",
          inventoryNumber: "26008",
          startDate: "16.11.2021.",
          endDate: "19.11.2021.",
        },
        {
          bookTitle: "Sapiens - A Brief History of Humankind",
          author: "Yuval Noah Harari",
          inventoryNumber: "57961",
          startDate: "15.11.2021.",
          endDate: "18.11.2021.",
        },
      ],
    }
  },
  methods: {
    openDialog() {},
  },
}
</script>

<style scoped>
.v-data-table {
  max-width: 80% !important;
}

@media only screen and (max-width: 1264px) {
  .v-data-table {
    max-width: 100% !important;
  }
}

.v-data-table >>> .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 1rem !important;
}
</style>
