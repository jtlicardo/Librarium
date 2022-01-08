<template>
  <v-card
    max-width="500px"
    @click="
      emitBookTitle()
      toggleBackButton()
    "
  >
    <div class="d-flex flex-no-wrap justify-space-between mt-3">
      <div class="card-content">
        <v-card-title
          class="text-subtitle-1 text-sm-h5 text-md-subtitle-1 text-lg-h6 word-break"
        >
          <b class="mx-auto">{{ title }}</b>
        </v-card-title>
        <v-card-subtitle>by {{ author }}</v-card-subtitle>
        <v-divider></v-divider>
        <v-card-subtitle class="pb-0"><b>Genres</b></v-card-subtitle>
        <v-card-subtitle class="pt-0">{{ allGenres }}</v-card-subtitle>
        <v-card-subtitle class="pb-0" v-if="!userIsAdmin">
          <b>Average rating</b>
        </v-card-subtitle>
        <v-card-subtitle class="pt-0" v-if="!userIsAdmin">
          {{ avgRating }}
        </v-card-subtitle>
        <v-card-subtitle class="pb-0" v-if="userIsAdmin">
          <b>Number of copies</b>
        </v-card-subtitle>
        <v-card-subtitle class="pt-0" v-if="userIsAdmin">
          {{ copies.length }}
        </v-card-subtitle>
        <v-btn color="red white--text my-3" v-if="userIsAdmin" @click.stop="deleteBook">
          Delete
        </v-btn>
      </div>

      <v-img
        :src="imagesource"
        contain
        max-height="100px"
        max-width="100px"
        class="my-auto card-picture"
      ></v-img>
    </div>
  </v-card>
</template>

<script>
export default {
  props: ["title", "author", "imagesource", "genres", "reviews", "copies", "added"],
  methods: {
    emitBookTitle() {
      this.$emit("book-title", this.title)
    },
    toggleBackButton() {
      this.$store.dispatch("showBackButton")
      this.$store.dispatch("showBackButtonActive")
    },
    deleteBook() {
      this.$emit("delete", {
        title: this.title,
        author: this.author,
        logoUrl: this.imagesource,
        added_at: this.added,
      })
    },
  },
  computed: {
    allGenres() {
      if (this.genres.tertiaryGenre === "") {
        if (this.genres.secondaryGenre === "") {
          return this.genres.mainGenre
        } else return this.genres.mainGenre + ", " + this.genres.secondaryGenre
      } else
        return (
          this.genres.mainGenre +
          ", " +
          this.genres.secondaryGenre +
          ", " +
          this.genres.tertiaryGenre
        )
    },
    avgRating() {
      if (this.reviews.length === 0) return "N/A"
      let total = 0
      for (let review of this.reviews) {
        total += review.rating
      }
      return (total / this.reviews.length).toFixed(1)
    },
    userIsAdmin() {
      const userIsAdmin = localStorage.getItem("userIsAdmin")
      const isAdmin = userIsAdmin === "true"
      if (isAdmin) return true
      else return false
    },
  },
}
</script>

<style scoped>
.word-break {
  word-break: keep-all;
}

.card-content {
  width: 70%;
}

.card-picture {
  width: 30%;
  padding: 0;
  margin: 2%;
}
</style>
