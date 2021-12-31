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
        <book-copies
          class="mx-auto mt-5"
          :id="id"
          :title="bookTitle"
          :author="bookAuthor"
          @copy-deleted="getBookData"
          @copy-reserved="getBookData"
        />
        <v-row class="mt-5" v-if="userIsAdmin">
          <v-btn class="mx-auto" color="yellow darken-1" @click="openDialog">
            Add copy
          </v-btn>
        </v-row>
        <add-copy
          :active="addCopyDialogActive"
          :bookId="id"
          :title="bookTitle"
          :author="bookAuthor"
          @close-dialog="closeDialog"
          @copy-added="getBookData"
        ></add-copy>
        <div class="mt-14 pt-10 mb-15">
          <h3 class="text-center" id="reviews">Reviews by users</h3>
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
        <v-row class="reviews">
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
              @deleted="removeReview"
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
              @deleted="removeReview"
            />
          </v-col>
          <v-col cols="12" lg="1"></v-col>
        </v-row>
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="numOfPages"
            class="my-10"
            @previous="changePage"
            @next="changePage"
          ></v-pagination>
        </div>
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
import AddCopy from "@/components/book-details/AddCopy.vue"
import { doc, getDoc, db } from "@/firebase.js"

export default {
  props: ["id"],
  components: {
    BookCopies,
    BookReview,
    SubmitReview,
    BookDetailsLoading,
    AddCopy,
  },
  data() {
    return {
      selectedBook: null,
      allReviews: [],
      reviewsGroup: [],
      loading: true,
      reviewExists: false,
      addCopyDialogActive: false,
      page: 1,
      arrowPageChange: false,
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
    numOfPages() {
      if (!!this.selectedBook) return Math.ceil(this.selectedBook.reviews.length / 6)
    },
    bookReviewsFirstHalf() {
      if (!!this.selectedBook) {
        const reviews = this.reviewsGroup
        const half = Math.ceil(reviews.length / 2)
        return reviews.slice(0, half)
      }
    },
    bookReviewsSecondHalf() {
      if (!!this.selectedBook) {
        const reviews = this.reviewsGroup
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
    async changePage() {
      this.arrowPageChange = true
      document.querySelector(".reviews").classList.toggle("fadeout")
      await this.timeout(500)
      this.splitReviews(this.page)
      document.querySelector(".reviews").classList.toggle("fadein")
      await this.timeout(500)
      document.querySelector(".reviews").classList.remove("fadeout")
      document.querySelector(".reviews").classList.remove("fadein")
      document
        .querySelector("#reviews")
        .scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
      this.arrowPageChange = false
    },
    async getBookData() {
      this.loading = true
      this.selectedBook = null
      this.allReviews = []
      this.reviewsGroup = []
      const docRef = doc(db, "books", this.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        this.selectedBook = docSnap.data()
        for (let review of docSnap.data().reviews) {
          this.allReviews.push(review)
        }
        console.log("Book data: ", this.selectedBook)
      } else {
        console.log("No such document!")
      }
      await this.timeout(1000)
      this.loading = false
    },
    removeReview(userId) {
      this.allReviews = this.allReviews.filter((review) => review.userId !== userId)
      this.page = 1
      this.checkIfReviewExists()
      this.splitReviews(1)
    },
    splitReviews(pageNum) {
      this.reviewsGroup = []
      let startSliceNum = 0
      if (pageNum > 1) startSliceNum = 6 * (pageNum - 1)
      this.reviewsGroup = this.allReviews.slice(startSliceNum, startSliceNum + 6)
    },
    async checkIfReviewExists() {
      const booksRef = doc(db, "books", this.id)
      const userId = localStorage.getItem("userId")
      const docSnap = await getDoc(booksRef)
      if (docSnap.exists()) {
        const reviewers = docSnap.data().reviewsUserIds
        for (let reviewer of reviewers) {
          if (reviewer === userId) this.reviewExists = true
        }
      }
    },
    openDialog() {
      this.addCopyDialogActive = true
    },
    closeDialog() {
      this.addCopyDialogActive = false
    },
  },
  watch: {
    page(newValue) {
      if (!this.arrowPageChange) {
        document.querySelector(".reviews").classList.toggle("fadeout")
        this.timeout(500).then(() => {
          this.splitReviews(newValue)
          document.querySelector(".reviews").classList.toggle("fadein")
          this.timeout(500).then(() => {
            document.querySelector(".reviews").classList.remove("fadeout")
            document.querySelector(".reviews").classList.remove("fadein")
            document
              .querySelector("#reviews")
              .scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
          })
        })
      }
    },
  },
  async created() {
    await this.getBookData()
    await this.checkIfReviewExists()
    this.splitReviews(1)
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

.fadeout {
  opacity: 0;
  transition: all 0.5s;
}

.fadein {
  opacity: 1;
  transition: all 0.5s;
}
</style>
