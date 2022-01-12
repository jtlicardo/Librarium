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
                    validate-on-blur
                    maxlength="60"
                    v-model.trim="book.title"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pt-0">
                  <v-text-field
                    label="Author"
                    required
                    :rules="[rules.required]"
                    counter
                    validate-on-blur
                    maxlength="30"
                    v-model.trim="book.author"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" id="genres">
                  <v-text-field
                    label="Main genre"
                    :rules="[rules.required, rules.genreMax]"
                    required
                    validate-on-blur
                    v-model.trim="book.genres.mainGenre"
                  ></v-text-field>
                  <v-text-field
                    label="Additional genre (optional)"
                    :rules="[rules.genreMax]"
                    validate-on-blur
                    v-model.trim="book.genres.secondaryGenre"
                  ></v-text-field>
                  <v-text-field
                    label="Additional genre (optional)"
                    :rules="[rules.genreMax]"
                    validate-on-blur
                    v-model.trim="book.genres.tertiaryGenre"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Number of pages"
                    type="number"
                    :rules="[rules.required, rules.positive]"
                    required
                    validate-on-blur
                    v-model="book.numOfPages"
                  ></v-text-field>
                  <v-text-field
                    label="Inventory number"
                    type="number"
                    hint="Enter the inventory number of the first copy"
                    persistent-hint
                    :rules="[rules.required, rules.positive, rules.max]"
                    validate-on-blur
                    required
                    v-model="book.copies[0].inventoryNumber"
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
          <v-btn color="gray darken-1" class="px-4 mx-auto" text @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn color="yellow darken-1" class="px-4 mx-auto" @click="addBook">
            Add book
          </v-btn>
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
import {
  db,
  collection,
  addDoc,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  updateDoc,
  doc,
  arrayUnion,
  query,
  where,
  getDocs,
} from "@/firebase.js"
export default {
  props: ["active"],
  emits: ["close-dialog"],
  components: {
    ErrorPopup,
  },
  data() {
    return {
      book: {
        title: "",
        author: "",
        genres: {
          mainGenre: "",
          secondaryGenre: "",
          tertiaryGenre: "",
        },
        numOfPages: "",
        copiesInvNums: [],
        copies: [
          {
            inventoryNumber: "",
            status: "Available",
          },
        ],
        logoUrl: "",
        added_at: Date.now(),
        reviewsUserIds: [],
        reviews: [],
      },
      logo: null,
      rules: {
        required: (value) => !!value || "Required",
        positive: (value) => (value && value > 0) || "Must be a positive number",
        max: (value) => (value && value.length < 8) || "Inventory number is too long!",
        genreMax: (value) =>
          value === null || value.length < 25 || "Genre name is too long!",
      },
      validationError: false,
      errorMsg: "",
      isLoading: false,
      addingBookError: false,
      addingBookErrorMsg: "",
    }
  },
  computed: {
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          return true
        default:
          return false
      }
    },
  },
  methods: {
    openFileDialog() {
      document.querySelector("#fileinput").click()
    },
    closeDialog() {
      this.book.title = ""
      this.book.author = ""
      this.book.genres.mainGenre = ""
      this.book.genres.secondaryGenre = ""
      this.book.genres.tertiaryGenre = ""
      this.book.numOfPages = ""
      this.book.copies[0].inventoryNumber = ""
      this.logo = null
      this.$refs.form.resetValidation()
      this.$emit("close-dialog")
    },
    validate() {
      if (
        this.book.title === "" ||
        this.book.author === "" ||
        this.book.genres.mainGenre === "" ||
        this.book.numOfPages === "" ||
        this.book.copies[0].inventoryNumber === "" ||
        this.logo === null
      ) {
        this.validationError = true
        this.errorMsg = "Please fill in all the required fields!"
        return false
      } else if (this.book.numOfPages <= 0) {
        this.validationError = true
        this.errorMsg = "Number of pages needs to be a positive number!"
        return false
      } else if (
        this.book.genres.mainGenre.length >= 25 ||
        this.book.genres.secondaryGenre.length >= 25 ||
        this.book.genres.tertiaryGenre.length >= 25
      ) {
        this.validationError = true
        this.errorMsg = "Genre name is too long!"
        return false
      } else if (this.book.copies[0].inventoryNumber <= 0) {
        this.validationError = true
        this.errorMsg = "Inventory number needs to be a positive number!"
        return false
      } else if (this.book.copies[0].inventoryNumber.length >= 8) {
        this.validationError = true
        this.errorMsg = "Inventory number is too long!"
        return false
      } else return true
    },
    async checkIfBookExists() {
      const booksRef = collection(db, "books")
      const q = query(
        booksRef,
        where("title", "==", this.book.title),
        where("author", "==", this.book.author)
      )
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty === true) return false
      else {
        this.validationError = true
        this.errorMsg = "Book already exists!"
        return true
      }
    },
    async addBook() {
      if (!this.validate()) return
      const exists = await this.checkIfBookExists()
      if (exists) return
      this.$store.dispatch("displayLoadingDialog", {
        active: true,
        title: "Adding book...",
      })
      try {
        const docRef = await addDoc(collection(db, "books"), {
          ...this.book,
        })
        console.log("Document written with ID: ", docRef.id)
        const storageRef = ref(storage, docRef.id)
        await uploadBytes(storageRef, this.logo)
        const url = await getDownloadURL(ref(storage, docRef.id))
        console.log(url)
        const docReference = doc(db, "books", docRef.id)
        await updateDoc(docReference, {
          logoUrl: url,
          copiesInvNums: arrayUnion(this.book.copies[0].inventoryNumber),
        })
        this.$store.dispatch("displaySnackbar", {
          text: "Book successfully added!",
          isActive: true,
        })
        if (!this.isMobile) this.$root.$emit("getAllBooks")
        else this.$root.$emit("getAllBooksMobile")
      } catch (e) {
        console.log("Error while adding book: ", e)
        this.$store.dispatch("displayBaseDialog", {
          text: e.toString(),
          title: "Error! Please try again later.",
          color: "red",
          loading: false,
          active: true,
        })
      }
      this.$store.dispatch("displayLoadingDialog", {
        active: false,
        title: "",
      })
      this.closeDialog()
    },
    handleError() {
      setTimeout(() => {
        this.addingBookError = false
        this.addingBookErrorMsg = ""
      }, 500)
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
