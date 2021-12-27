<template>
  <v-container class="mt-md-10">
    <v-row v-if="selectedBook">
      <v-col cols="12" md="2"></v-col>
      <v-col cols="12" md="8">
        <h1 class="mb-3 text-center">{{ bookTitle }}</h1>
        <h2 class="text-center">by {{ bookAuthor }}</h2>
        <v-img :src="bookLogo" max-width="200px" class="mx-auto mt-10"></v-img>
        <h3 class="mt-14 pt-10 text-center">
          All copies for
          <b>{{ bookTitle }}</b>
        </h3>
        <book-copies class="mt-5 mx-auto" :id="id" />
        <div class="mt-14 pt-10 mb-15">
          <h3 class="text-center">Reviews by users</h3>
          <div class="d-flex justify-center mt-10" v-if="hasReviews">
            <h3 class="align-self-center">Average rating</h3>
            <v-progress-circular
              class="ml-5"
              size="60"
              color="yellow darken-2"
              width="6"
              rotate="-90"
              :value="avgRatingValue"
            >
              {{ avgRating }}
            </v-progress-circular>
          </div>
        </div>
        <h4 v-if="!hasReviews" class="text-center">No reviews yet :(</h4>
        <book-review
          v-for="review in bookReviews"
          :key="review.userId"
          :title="review.title"
          :name="review.displayName"
          :comment="review.comment"
          :rating="review.rating"
        />
        <h3 class="mt-14 pt-10 text-center">Submit your own review</h3>
        <submit-review :id="id" />
      </v-col>
      <v-col cols="12" md="2"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import BookCopies from "@/components/book-details/BookCopies.vue"
import BookReview from "@/components/book-details/BookReview.vue"
import SubmitReview from "@/components/book-details/SubmitReview.vue"
import { doc, getDoc, db } from "@/firebase.js"

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
      return this.selectedBook.logoUrl
    },
    hasReviews() {
      return this.selectedBook.reviews && this.selectedBook.reviews.length > 0
    },
    bookReviews() {
      return this.selectedBook.reviews
    },
    avgRating() {
      const reviews = this.selectedBook.reviews
      const numOfReviews = this.selectedBook.reviews.length
      let ratingSum = 0
      for (let review of reviews) {
        ratingSum += review.rating
      }
      return (ratingSum / numOfReviews).toFixed(1)
    },
    avgRatingValue() {
      return (this.avgRating / 5) * 100
    },
  },
  methods: {
    async getBookData() {
      const docRef = doc(db, "books", this.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        this.selectedBook = docSnap.data()
        console.log("Book data: ", this.selectedBook)
      } else {
        console.log("No such document!")
      }
    },
  },
  beforeMount() {
    this.getBookData()
  },
}
</script>

<style scoped>
h2,
h3 {
  font-weight: 400;
}

.v-progress-circular >>> .v-progress-circular__info {
  color: black;
  font-weight: 700;
}
</style>
