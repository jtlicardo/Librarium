<template>
  <v-data-table
    :headers="headers"
    :items="loans"
    hide-default-footer
    class="elevation-1"
    :loading="loading"
  >
    <!-- <template v-slot:[`item.edit`]="{ item }">
      <v-icon color="red" @click="editLoan(item)">mdi-trash-can-outline</v-icon>
    </template> -->
  </v-data-table>
</template>

<script>
export default {}
</script>

<style></style>
