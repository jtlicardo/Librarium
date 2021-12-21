<template>
  <v-form class="form mt-5">
    <v-text-field label="Title" v-model="title" counter="40"></v-text-field>
    <p class="d-inline">Rating</p>
    <v-rating
      background-color="grey lighten-1"
      color="yellow darken-1"
      hover
      dense
      length="5"
      size="36"
      value="5"
      v-model="rating"
      class="d-inline ml-5"
    ></v-rating>
    <v-textarea
      name="input-7-1"
      label="Comment"
      v-model="comment"
      counter="300"
      no-resize
    ></v-textarea>
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
