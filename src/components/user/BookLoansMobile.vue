<template>
  <v-data-table
    :headers="headerTitles"
    :items="reservations"
    :single-expand="singleExpand"
    item-key="name"
    show-expand
    hide-default-header
    hide-default-footer
    class="elevation-1 grey lighten-4"
    @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
  >
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length" class="py-5">
        <b class="text-h6">LOAN DETAILS</b>
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
          <b>Issue date:</b>
          {{ item.issueDate }}
        </p>
        <p class="my-0">
          <b>Due date:</b>
          {{ item.dueDate }}
        </p>
        <v-btn class="mt-3 black--text" color="yellow darken-1">SEND REQUEST</v-btn>
      </td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      singleExpand: true,
      headerTitles: [
        {
          text: "",
          align: "start",
          sortable: false,
          value: "name",
        },
        {
          text: "",
          value: "data-table-expand",
        },
      ],
      reservations: [
        {
          name: "Crime and Punishment",
          author: "Fyodor Dostoevsky",
          inventoryNumber: "26008",
          issueDate: "16.11.2021.",
          dueDate: "19.11.2021.",
        },
        {
          name: "Sapiens - A Brief History of Humankind",
          author: "Yuval Noah Harari",
          inventoryNumber: "57961",
          issueDate: "15.11.2021.",
          dueDate: "18.11.2021.",
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
