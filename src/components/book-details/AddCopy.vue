<template>
  <v-row justify="center">
    <v-dialog v-model="active" persistent width="400px">
      <v-card>
        <v-card-title>
          <h2 class="mx-auto">Add copy</h2>
        </v-card-title>
        <v-card-subtitle>
          <h3 class="text-center mt-10">{{ title }}</h3>
          <h3 class="text-center mb-10">by {{ author }}</h3>
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
            label="Enter inventory number"
            required
            v-model="inventoryNumber"
            type="number"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray darken-1" class="px-4 mx-auto" text @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn color="yellow darken-1" class="px-4 mx-auto" @click="addBook">
            Add copy
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ["active", "title", "author"],
  data() {
    return {
      inventoryNumber: "",
    }
  },
  methods: {
    closeDialog() {
      this.inventoryNumber = ""
      this.$emit("close-dialog")
    },
  },
}
</script>

<style scoped></style>
