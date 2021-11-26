<template>
  <v-card max-width="500px">
    <div class="d-flex flex-no-wrap justify-space-between mt-3">
      <div>
        <v-card-title class="text-subtitle-1 text-sm-h5 text-md-subtitle-1 text-lg-h5">
          Crime and Punishment
        </v-card-title>
        <v-card-subtitle>by Fyodor Dostoevsky</v-card-subtitle>
      </div>
      <v-avatar class="ma-3" :size="cardSize" tile>
        <v-img src="@/assets/book_logos/cap.jpg" contain></v-img>
      </v-avatar>
    </div>
  </v-card>
</template>

<script>
export default {
  computed: {
    cardSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          return 100
        default:
          return 125
      }
    },
  },
}
</script>

<style></style>
