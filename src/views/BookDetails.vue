<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="2"></v-col>
      <v-col cols="12" md="8">
        <h1 class="mb-3 text-center">{{ bookTitle }}</h1>
        <h2 class="text-center">by {{ bookAuthor }}</h2>
        <v-img :src="bookLogo" max-width="200px" class="mx-auto mt-10"></v-img>
        <h3 class="mt-14 pt-10 text-center">
          All copies for
          <b>{{ bookTitle }}</b>
        </h3>
        <book-copies class="mt-5 mx-auto" :bookId="id" />
        <div class="d-flex mt-14 pt-10 mb-10 justify-space-between">
          <h3>Reviews by users</h3>
          <h3 v-if="hasReviews">Average rating</h3>
        </div>
        <h4 v-if="!hasReviews">No reviews yet :(</h4>
        <book-review
          v-for="review in bookReviews"
          :key="review.id"
          :title="review.title"
          :userId="review.userId"
          :comment="review.comment"
          :rating="review.rating"
        />
        <h3 class="mt-14 pt-10">Submit your own review</h3>
        <submit-review />
      </v-col>
      <v-col cols="12" md="2"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import BookCopies from "@/components/BookCopies.vue"
import BookReview from "@/components/BookReview.vue"
import SubmitReview from "@/components/SubmitReview.vue"

export default {
  props: ["id"],
  components: {
    BookCopies,
    BookReview,
    SubmitReview,
  },
  data() {
    return {
      selectedBook: null,
    }
  },
  computed: {
    bookTitle() {
      return this.selectedBook.title
    },
    bookAuthor() {
      return this.selectedBook.author
    },
    bookLogo() {
      return this.selectedBook.logo
    },
    hasReviews() {
      return this.selectedBook.reviews && this.selectedBook.reviews.length > 0
    },
    bookReviews() {
      return this.selectedBook.reviews
    },
  },
  created() {
    this.selectedBook = this.$store.getters["books/allBooks"].find(
      (book) => book.id === this.id
    )
  },
}
</script>

<style scoped>
h2,
h3 {
  font-weight: 400;
}
</style>
