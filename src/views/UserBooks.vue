<template>
  <div>
    <h1>Search for a book...</h1>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="5">
            <v-text-field v-model="firstname" label="Title"></v-text-field>

            <v-text-field v-model="lastname" label="Author"></v-text-field>

            <v-text-field v-model="email" label="Genre"></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="5">Recently added books</v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
h1 {
  font-weight: 400;
}
</style>
