<template>
  <v-row justify="center">
    <v-dialog v-model="active" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <h2 class="mx-auto">Add book</h2>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Book title" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Author" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Main genre" required></v-text-field>
                <v-text-field label="Additional genre (optional)"></v-text-field>
                <v-text-field label="Additional genre (optional)"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Number of pages"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Inventory number"
                  type="number"
                  hint="Enter the inventory number of the first copy"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  label="Logo"
                  chips
                  required
                  accept=".png,.jpeg,.jpg"
                  hint="File must be in .png, .jpeg or .jpg format"
                  persistent-hint
                  prepend-icon=""
                  prepend-inner-icon="mdi-image"
                  @click:prepend-inner="openFileDialog"
                  id="fileinput"
                ></v-file-input>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="gray darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="yellow darken-1" @click="closeDialog">Add book</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ["active"],
  emits: ["close-dialog"],
  methods: {
    openFileDialog() {
      document.querySelector("#fileinput").click()
    },
    closeDialog() {
      this.$emit("close-dialog")
    },
  },
}
</script>

<style></style>
