<template>
  <v-card
    max-width="500px"
    @click="
      emitBookTitle()
      toggleBackButton()
    "
  >
    <div class="d-flex flex-no-wrap justify-space-between mt-3">
      <div>
        <v-card-title
          class="text-subtitle-1 text-sm-h5 text-md-subtitle-1 text-lg-h6 word-break"
        >
          <b>{{ title }}</b>
        </v-card-title>
        <v-card-subtitle>by {{ author }}</v-card-subtitle>
        <v-divider></v-divider>
        <v-card-subtitle class="pb-0"><b>Genres</b></v-card-subtitle>
        <v-card-subtitle class="pt-0">{{ allGenres }}</v-card-subtitle>
        <v-card-subtitle class="pb-0"><b>Average rating</b></v-card-subtitle>
        <v-card-subtitle class="pt-0">{{ avgRating }}</v-card-subtitle>
      </div>
      <v-avatar class="ma-3 my-auto" size="110" tile>
        <v-img :src="imagesource" contain></v-img>
      </v-avatar>
    </div>
  </v-card>
</template>

<script>
export default {
  props: ["title", "author", "imagesource", "genres", "reviews"],
  methods: {
    emitBookTitle() {
      this.$emit("book-title", this.title)
    },
    toggleBackButton() {
      this.$store.dispatch("showBackButton")
      this.$store.dispatch("showBackButtonActive")
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
  },
}
</script>

<style scoped>
.word-break {
  word-break: keep-all;
}
</style>
