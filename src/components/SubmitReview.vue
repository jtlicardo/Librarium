<template>
  <v-form class="form mt-5">
    <v-text-field label="Title" v-model="title"></v-text-field>
    <v-text-field label="Rating" v-model="rating"></v-text-field>
    <v-rating
      background-color="grey lighten-1"
      color="yellow"
      empty-icon="$mdiStarOutline"
      full-icon="$mdiStar"
      hover
      length="5"
      size="12"
      value="0"
    ></v-rating>
    <v-textarea name="input-7-1" label="Comment" v-model="comment" no-resize></v-textarea>
    <v-btn elevation="2" color="yellow darken-1" class="mt-5 mb-5">Submit</v-btn>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      rating: null,
      comment: "",
    }
  },
}
</script>

<style scoped>
.form {
  max-width: 50%;
}
</style>
