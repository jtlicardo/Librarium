<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" lg="1" xl="2"></v-col>
      <v-col cols="12" lg="4" xl="3">
        <h1 class="mb-5">Search for a book...</h1>
        <v-form>
          <v-text-field label="Title" v-model.trim="searchFilter.title"></v-text-field>
          <v-text-field label="Author" v-model.trim="searchFilter.author"></v-text-field>
          <v-text-field label="Genre" v-model.trim="searchFilter.genre"></v-text-field>
          <v-btn elevation="2" color="yellow darken-1" class="mt-5 mb-5" @click="search">
            Search
          </v-btn>
          <h3 class="mt-5">
            ...or
            <a @click="search">see all books.</a>
          </h3>
        </v-form>
      </v-col>
      <v-col cols="2"></v-col>
      <v-col cols="12" md="5">
        <h1>Recently added books</h1>
        <recently-added></recently-added>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RecentlyAdded from "@/components/user/RecentlyAdded.vue"

export default {
  components: {
    RecentlyAdded,
  },
  data() {
    return {
      searchFilter: {
        title: "",
        author: "",
        genre: "",
      },
    }
  },
  methods: {
    toggleBackButton() {
      this.$store.dispatch("showBackButton")
      this.$store.dispatch("showBackButtonActive")
    },
    search() {
      this.toggleBackButton()
      this.$router.push({
        name: "User Search",
        query: {
          title: this.searchFilter.title,
          author: this.searchFilter.author,
          genre: this.searchFilter.genre,
        },
      })
    },
  },
}
</script>

<style scoped>
h1,
h3 {
  font-weight: 400;
}

h3,
h3 a {
  color: gray;
}

h3 a {
  text-decoration: underline;
  font-weight: 500;
}
</style>
