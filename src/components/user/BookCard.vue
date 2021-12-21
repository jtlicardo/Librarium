<template>
  <v-card max-width="500px">
    <div class="d-flex flex-no-wrap justify-space-between mt-3">
      <div>
        <v-card-title
          class="text-subtitle-1 text-sm-h5 text-md-subtitle-1 text-lg-h6 word-break"
        >
          {{ title }}
        </v-card-title>
        <v-card-subtitle>by {{ author }}</v-card-subtitle>
      </div>
      <v-avatar class="ma-3" :size="cardSize" tile>
        <v-img :src="imagesource" contain></v-img>
      </v-avatar>
    </div>
  </v-card>
</template>

<script>
export default {
  props: ["title", "author", "imagesource"],
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

<style scoped>
.word-break {
  word-break: keep-all;
}
</style>
