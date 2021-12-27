<template>
  <v-form class="form mt-5 elevation-1">
    <p class="text-center mb-2 rating-text">RATING</p>
    <v-rating
      background-color="grey lighten-1"
      color="yellow darken-1"
      hover
      dense
      length="5"
      size="36"
      value="5"
      v-model="rating"
      class="text-center mb-5"
    ></v-rating>

    <v-text-field v-model="title" counter maxlength="40" label="Title"></v-text-field>
    <v-textarea
      name="input-7-1"
      label="Comment"
      v-model="comment"
      counter
      maxlength="300"
      no-resize
    ></v-textarea>
    <div class="text-center">
      <v-btn elevation="2" color="yellow darken-1" class="my-5" @click="submitReview">
        Submit
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import { db, doc, updateDoc, arrayUnion } from "@/firebase.js"

export default {
  props: ["id"],
  data() {
    return {
      title: "",
      rating: null,
      comment: "",
    }
  },
  methods: {
    async submitReview() {
      const userId = localStorage.getItem("userId")
      const displayName = localStorage.getItem("userFullname")
      const booksRef = doc(db, "books", this.id)
      await updateDoc(booksRef, {
        reviews: arrayUnion({
          userId: userId,
          displayName: displayName,
          title: this.title,
          comment: this.comment,
          rating: this.rating,
        }),
      })
    },
  },
}
</script>

<style scoped>
.form {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 5px;
  padding: 20px 30px;
  background-color: #fafafa;
}

.theme--light.v-input >>> input {
  font-weight: 500;
}

.rating-text {
  font-weight: 700;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.8rem;
}
</style>
