<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="12" md="3">
        <h1 class="mb-5">Search for a book...</h1>
        <v-form>
          <v-text-field v-model="firstname" label="Title"></v-text-field>
          <v-text-field v-model="lastname" label="Author"></v-text-field>
          <v-text-field v-model="email" label="Genre"></v-text-field>
          <v-select
            :items="options"
            placeholder="Number of pages"
            solo
            clearable
            class="mt-2"
          ></v-select>
          <v-btn elevation="2" color="yellow darken-1">Search</v-btn>
          <h3 class="mt-5">
            ...or
            <u>see all books.</u>
          </h3>
        </v-form>
      </v-col>
      <v-col cols="2"></v-col>
      <v-col cols="12" md="5">
        <h1>Recently added books</h1>
        <div class="mt-5">
          <book-card></book-card>
          <book-card></book-card>
          <book-card></book-card>
          <book-card></book-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BookCard from "@/components/BookCard.vue"

export default {
  components: {
    BookCard,
  },
  data: () => ({
    options: [
      "Short ( < 100 pages )",
      "Medium ( 100 - 400 pages )",
      "Long ( > 400 pages )",
    ],
  }),
}
</script>

<style scoped>
h1,
h3 {
  font-weight: 400;
}
</style>
