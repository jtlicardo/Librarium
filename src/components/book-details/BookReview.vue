<template>
  <v-card
    elevation="2"
    height="220px"
    width="100%"
    class="my-2"
    :class="{ 'mx-2': !mobile }"
  >
    <v-card-title>
      {{ title }}
      <v-spacer></v-spacer>
      <v-icon color="red" v-if="userIsAdmin || userIsReviewer" @click="deleteReview">
        mdi-trash-can-outline
      </v-icon>
    </v-card-title>
    <v-card-subtitle class="d-flex align-center">
      <b class="mr-1">{{ name }}</b>
      rated it
      <v-rating
        background-color="grey lighten-1"
        color="yellow darken-2"
        hover
        dense
        readonly
        length="5"
        size="20"
        :value="rating"
        class="ml-1"
      ></v-rating>
    </v-card-subtitle>
    <v-card-text class="black--text">{{ comment }}</v-card-text>
  </v-card>
</template>

<script>
import { doc, db, updateDoc, arrayRemove } from "@/firebase.js"
export default {
  props: ["userId", "title", "name", "comment", "rating"],
  emits: ["deleted"],
  computed: {
    userIsAdmin() {
      const userIsAdmin = localStorage.getItem("userIsAdmin")
      const isAdmin = userIsAdmin === "true"
      if (isAdmin) return true
      else return false
    },
    userIsReviewer() {
      const userId = localStorage.getItem("userId")
      if (userId === this.userId) return true
      else return false
    },
    mobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          return true
        default:
          return false
      }
    },
  },
  methods: {
    async deleteReview() {
      const bookId = this.$router.currentRoute.params.id
      const userId = localStorage.getItem("userId")
      const docRef = doc(db, "books", bookId)
      await updateDoc(docRef, {
        reviews: arrayRemove({
          userId: this.userId,
          displayName: this.name,
          title: this.title,
          comment: this.comment,
          rating: this.rating,
        }),
      })
      await updateDoc(docRef, {
        reviewsUserIds: arrayRemove(userId),
      })
      this.$store.dispatch("displaySnackbar", {
        text: "Review deleted!",
        isActive: true,
      })
      this.$emit("deleted", userId)
    },
  },
}
</script>

<style scoped>
.v-card {
  display: inline-block;
}
.v-rating--dense >>> .v-icon {
  padding: 0;
}

.v-card >>> .v-card__text {
  height: 120px;
}

@media only screen and (max-width: 600px) {
  .v-card >>> .v-card__text {
    height: 160px;
  }
}
</style>
