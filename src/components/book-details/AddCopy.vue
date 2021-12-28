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
            v-model.trim="inventoryNumber"
            counter
            maxlength="7"
            type="number"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray darken-1" class="px-4 mx-auto" text @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn color="yellow darken-1" class="px-4 mx-auto" @click="addCopy">
            Add copy
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { doc, getDoc, db, updateDoc, arrayUnion } from "@/firebase.js"
export default {
  props: ["active", "bookId", "title", "author"],
  emits: ["close-dialog", "copy-added"],
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
    validate() {
      if (this.inventoryNumber === "") {
        this.$store.dispatch("displayErrorPopup", {
          isActive: true,
          text: "Please enter a number!",
        })
        return false
      } else if (this.inventoryNumber.length > 7) {
        this.$store.dispatch("displayErrorPopup", {
          isActive: true,
          text: "Inventory number too long!",
        })
        return false
      } else return true
    },
    async checkIfCopyExists() {
      try {
        const docRef = doc(db, "books", this.bookId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const inventoryNumbers = docSnap.data().copiesInvNums
          for (let num of inventoryNumbers) {
            if (num === this.inventoryNumber) {
              this.$store.dispatch("displayErrorPopup", {
                isActive: true,
                text: "Inventory number already exists!",
              })
              return true
            } else return false
          }
        }
      } catch (e) {
        console.log(e)
        this.$store.dispatch("displayBaseDialog", {
          text: e.toString(),
          title: "Error! Please try again later.",
          color: "red",
          loading: false,
          active: true,
        })
      }
    },
    async addCopy() {
      if (!this.validate()) return
      if (await this.checkIfCopyExists()) return
      this.$store.dispatch("displayLoadingDialog", {
        active: true,
        title: "Adding copy...",
      })
      try {
        const booksRef = doc(db, "books", this.bookId)
        await updateDoc(booksRef, {
          copiesInvNums: arrayUnion(this.inventoryNumber),
        })
        await updateDoc(booksRef, {
          copies: arrayUnion({
            inventoryNumber: this.inventoryNumber,
            status: "Available",
          }),
        })
        this.$store.dispatch("displaySnackbar", {
          text: "Copy successfully added!",
          isActive: true,
        })
        this.$store.dispatch("displayLoadingDialog", {
          active: false,
          title: "",
        })
        this.$emit("copy-added")
        this.closeDialog()
      } catch (e) {
        console.log(e)
        this.$store.dispatch("displayBaseDialog", {
          text: e.toString(),
          title: "Error! Please try again later.",
          color: "red",
          loading: false,
          active: true,
        })
      }
    },
  },
}
</script>

<style scoped></style>
