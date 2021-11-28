<template>
  <v-data-table
    :headers="headerTitles"
    :items="reservations"
    :single-expand="singleExpand"
    :expanded.sync="expanded"
    item-key="name"
    show-expand
    hide-default-header
    hide-default-footer
    class="elevation-1 grey lighten-3"
  >
    <template v-slot:top></template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length" class="py-5">
        <b class="text-h6">RESERVATIONS DETAILS</b>
        <p class="my-0">
          <b>Book title:</b>
          {{ item.name }}
        </p>
        <p class="my-0">
          <b>Author:</b>
          {{ item.author }}
        </p>
        <p class="my-0">
          <b>Inventory number:</b>
          {{ item.inventoryNumber }}
        </p>
        <p class="my-0">
          <b>Start date:</b>
          {{ item.startDate }}
        </p>
        <p class="my-0">
          <b>End date:</b>
          {{ item.endDate }}
        </p>
        <v-btn class="mt-3 white--text" color="red darken-1">CANCEL RESERVATION</v-btn>
      </td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      expanded: ["what"],
      singleExpand: true,
      headerTitles: [
        {
          text: "",
          align: "start",
          sortable: false,
          value: "name",
        },
      ],
      reservations: [
        {
          name: "Crime and Punishment",
          author: "Fyodor Dostoevsky",
          inventoryNumber: "26008",
          startDate: "16.11.2021.",
          endDate: "19.11.2021.",
        },
        {
          name: "Sapiens - A Brief History of Humankind",
          author: "Yuval Noah Harari",
          inventoryNumber: "57961",
          startDate: "15.11.2021.",
          endDate: "18.11.2021.",
        },
      ],
    }
  },
}
</script>

<style scoped>
.v-data-table {
  max-width: 100% !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 1rem !important;
}
</style>
