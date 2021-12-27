<template>
  <v-card elevation="2" height="220px" width="100%" class="mx-2 my-2">
    <v-card-title>{{ title }}</v-card-title>
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
export default {
  props: ["title", "name", "comment", "rating"],
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
  overflow: hidden;
}
</style>
