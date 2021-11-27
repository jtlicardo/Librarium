<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="2"></v-col>
      <v-col cols="12" md="3">
        <h1 class="mb-5">Search for a book...</h1>
        <v-form>
          <v-text-field label="Title"></v-text-field>
          <v-text-field label="Author"></v-text-field>
          <v-text-field label="Genre"></v-text-field>
          <v-btn elevation="2" color="yellow darken-1" class="mt-5 mb-5">Search</v-btn>
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
}
</script>

<style scoped>
h1,
h3 {
  font-weight: 400;
}
</style>
