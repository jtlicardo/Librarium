<template>
  <v-container class="mt-md-10">
    <transition name="fade">
      <book-details-loading v-if="loading"></book-details-loading>
      <div v-else>
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
          </v-col>
          <v-col cols="12" md="2"></v-col>
        </v-row>
        <book-copies class="mx-auto mt-5" :id="id" />
        <v-row class="mt-5" v-if="userIsAdmin">
          <v-btn class="mx-auto" color="yellow darken-1">Add copy</v-btn>
        </v-row>
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
        <h4 v-if="!hasReviews" class="text-center mb-10">No reviews yet :(</h4>
        <v-row>
          <v-col cols="12" lg="1"></v-col>
          <v-col cols="12" lg="5">
            <book-review
              v-for="review in bookReviewsFirstHalf"
              :key="review.userId"
              :userId="review.userId"
              :title="review.title"
              :name="review.displayName"
              :comment="review.comment"
              :rating="review.rating"
              @deleted="getBookData"
            />
          </v-col>
          <v-col cols="12" lg="5">
            <book-review
              v-for="review in bookReviewsSecondHalf"
              :key="review.userId"
              :userId="review.userId"
              :title="review.title"
              :name="review.displayName"
              :comment="review.comment"
              :rating="review.rating"
              @deleted="getBookData"
            />
          </v-col>
          <v-col cols="12" lg="1"></v-col>
        </v-row>
        <div v-if="!userIsAdmin && !reviewExists">
          <h3 class="mt-14 pt-10 text-center">Submit your own review</h3>
          <submit-review :id="id" />
        </div>
      </div>
    </transition>
  </v-container>
</template>

<script>
import BookCopies from "@/components/book-details/BookCopies.vue"
import BookReview from "@/components/book-details/BookReview.vue"
import SubmitReview from "@/components/book-details/SubmitReview.vue"
import BookDetailsLoading from "@/components/book-details/BookDetailsLoading.vue"
import { doc, getDoc, db } from "@/firebase.js"

export default {
  props: ["id"],
  components: {
    BookCopies,
    BookReview,
    SubmitReview,
    BookDetailsLoading,
  },
  data() {
    return {
      selectedBook: null,
      loading: true,
      reviewExists: false,
    }
  },
  computed: {
    userIsAdmin() {
      const userIsAdmin = localStorage.getItem("userIsAdmin")
      const isAdmin = userIsAdmin === "true"
      if (isAdmin) return true
      else return false
    },
    bookTitle() {
      if (!!this.selectedBook) return this.selectedBook.title
    },
    bookAuthor() {
      if (!!this.selectedBook) return this.selectedBook.author
    },
    bookLogo() {
      if (!!this.selectedBook) return this.selectedBook.logoUrl
    },
    hasReviews() {
      if (!!this.selectedBook)
        return this.selectedBook.reviews && this.selectedBook.reviews.length > 0
    },
    bookReviewsFirstHalf() {
      if (!!this.selectedBook) {
        const reviews = this.selectedBook.reviews
        const half = Math.ceil(reviews.length / 2)
        return reviews.slice(0, half)
      }
    },
    bookReviewsSecondHalf() {
      if (!!this.selectedBook) {
        const reviews = this.selectedBook.reviews
        const half = Math.ceil(reviews.length / 2)
        if (reviews.length === 1) return []
        else if (reviews.length % 2 === 0) {
          return reviews.slice(-half)
        } else return reviews.slice(-half + 1)
      }
    },
    avgRating() {
      if (!!this.selectedBook) {
        const reviews = this.selectedBook.reviews
        const numOfReviews = this.selectedBook.reviews.length
        let ratingSum = 0
        for (let review of reviews) {
          ratingSum += review.rating
        }
        return (ratingSum / numOfReviews).toFixed(1)
      }
    },
    avgRatingValue() {
      return (this.avgRating / 5) * 100
    },
  },
  methods: {
    timeout(miliseconds) {
      return new Promise((resolve) => setTimeout(resolve, miliseconds))
    },
    async getBookData() {
      this.loading = true
      this.selectedBook = null
      const docRef = doc(db, "books", this.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        this.selectedBook = docSnap.data()
        console.log("Book data: ", this.selectedBook)
      } else {
        console.log("No such document!")
      }
      await this.timeout(1000)
      this.loading = false
    },
    async checkIfReviewExists() {
      const booksRef = doc(db, "books", this.id)
      const userId = localStorage.getItem("userId")
      const docSnap = await getDoc(booksRef)
      if (docSnap.exists()) {
        console.log("Reviewers for this book:", docSnap.data().reviewsUserIds)
        const reviewers = docSnap.data().reviewsUserIds
        for (let reviewer of reviewers) {
          if (reviewer === userId) this.reviewExists = true
        }
      }
    },
  },
  async created() {
    await this.getBookData()
    await this.checkIfReviewExists()
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
