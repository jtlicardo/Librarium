<template>
  <v-row justify="center">
    <v-dialog v-model="active" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <h2 class="mx-auto">Add book</h2>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <v-col cols="12" class="mt-5 pb-0">
                  <v-text-field
                    label="Book title"
                    required
                    :rules="[rules.required]"
                    counter
                    maxlength="60"
                    v-model.trim="title"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pt-0">
                  <v-text-field
                    label="Author"
                    required
                    :rules="[rules.required]"
                    counter
                    maxlength="30"
                    v-model.trim="author"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" id="genres">
                  <v-text-field
                    label="Main genre"
                    :rules="[rules.required]"
                    required
                    v-model.trim="genres.mainGenre"
                  ></v-text-field>
                  <v-text-field
                    label="Additional genre (optional)"
                    v-model.trim="genres.secondaryGenre"
                  ></v-text-field>
                  <v-text-field
                    label="Additional genre (optional)"
                    v-model.trim="genres.tertiaryGenre"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Number of pages"
                    type="number"
                    :rules="[rules.required, rules.positive]"
                    required
                    v-model="numOfPages"
                  ></v-text-field>
                  <v-text-field
                    label="Inventory number"
                    type="number"
                    hint="Enter the inventory number of the first copy"
                    persistent-hint
                    :rules="[rules.required, rules.positive]"
                    required
                    v-model="inventoryNumber"
                  ></v-text-field>
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
                    v-model="logo"
                  ></v-file-input>
                </v-col>
                <v-col cols="12"></v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="gray darken-1" class="px-4" text @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn color="yellow darken-1" class="px-4" @click="addBook">Add book</v-btn>
        </v-card-actions>
        <error-popup
          :active="validationError"
          :text="errorMsg"
          @close-dialog="validationError = false"
        />
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import ErrorPopup from "@/components/ui/ErrorPopup.vue"
export default {
  props: ["active"],
  emits: ["close-dialog"],
  components: {
    ErrorPopup,
  },
  data() {
    return {
      title: "",
      author: "",
      genres: {
        mainGenre: "",
        secondaryGenre: "",
        tertiaryGenre: "",
      },
      numOfPages: "",
      inventoryNumber: "",
      logo: null,
      rules: {
        required: (value) => !!value || "Required",
        positive: (value) => (value && value > 0) || "Must be a positive number",
      },
      validationError: false,
      errorMsg: "",
    }
  },
  methods: {
    openFileDialog() {
      document.querySelector("#fileinput").click()
    },
    closeDialog() {
      this.$refs.form.reset()
      this.$emit("close-dialog")
    },
    validate() {
      if (
        this.title === "" ||
        this.author === "" ||
        this.genres.mainGenre === "" ||
        this.numOfPages === "" ||
        this.inventoryNumber === "" ||
        this.logo === null
      ) {
        this.validationError = true
        this.errorMsg = "Please fill in all the required fields!"
        return false
      } else if (this.numOfPages <= 0) {
        this.validationError = true
        this.errorMsg = "Number of pages needs to be a positive number!"
        return false
      } else if (this.inventoryNumber <= 0) {
        this.validationError = true
        this.errorMsg = "Inventory number needs to be a positive number!"
        return false
      } else return true
    },
    addBook() {
      if (!this.validate()) return
    },
  },
}
</script>

<style scoped>
#genres {
  border: 1px solid lightgray;
  border-radius: 20px;
}
</style>
