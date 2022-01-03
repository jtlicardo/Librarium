<template>
  <v-row justify="center">
    <v-dialog v-model="active" persistent width="500px">
      <v-card>
        <v-card-title>
          <h2 class="mx-auto">Edit loan</h2>
        </v-card-title>
        <v-card-subtitle v-if="!!loan">
          <h3 class="text-center mt-10" v-if="!loanIsFinished">
            Set the loan's status as 'Finished' or delete the loan
          </h3>
          <h3 class="text-center mt-10" v-else>This loan is set as "Finished"</h3>
          <h4 class="text-center mt-5">Book copy</h4>
          <p class="text-center mb-0">{{ loan.title }}</p>
          <p class="text-center mb-0">{{ loan.author }}</p>
          <p class="text-center">{{ loan.copyInvNumber }}</p>
          <h4 class="text-center mt-5">User</h4>
          <p class="text-center">{{ loan.user }}</p>
        </v-card-subtitle>
        <v-card-actions>
          <v-row>
            <v-col cols="12" sm="6" class="text-center">
              <v-btn
                color="red white--text"
                class="mx-auto"
                @click="deleteLoan"
                width="150px"
              >
                Delete loan
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6" class="text-center">
              <v-btn
                color="success white--text"
                class="mx-auto"
                @click="finishLoan"
                width="150px"
                v-if="!loanIsFinished"
              >
                Set as finished
              </v-btn>
              <v-btn
                color="brown white--text"
                class="mx-auto"
                @click="revertStatus"
                width="150px"
                v-else
              >
                Revert status
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
        <v-card-actions class="mt-5">
          <v-btn
            color="gray darken-1"
            class="mx-auto"
            text
            @click="closeDialog"
            width="150px"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { db, doc, updateDoc, getDoc, arrayUnion, arrayRemove } from "@/firebase.js"

export default {
  props: ["active", "loan"],
  emits: ["close-dialog", "refresh"],
  methods: {
    closeDialog() {
      this.$emit("close-dialog")
    },
    async finishLoan() {
      // update loan status
      const loansRef = doc(db, "loans", this.loan.firebaseLoanId)
      await updateDoc(loansRef, {
        loan_status: "Finished",
        return_time: Date.now(),
      })
      // update copy status
      const booksRef = doc(db, "books", this.loan.firebaseBookId)
      await updateDoc(booksRef, {
        copies: arrayRemove({
          inventoryNumber: this.loan.copyInvNumber,
          status: "Loaned",
        }),
      })
      await updateDoc(booksRef, {
        copies: arrayUnion({
          inventoryNumber: this.loan.copyInvNumber,
          status: "Available",
        }),
      })
      this.$emit("refresh")
      this.closeDialog()
    },
    async revertStatus() {
      // update loan status
      const docRef = doc(db, "loans", this.loan.firebaseLoanId)
      const docSnap = await getDoc(docRef)
      let due_time = null
      const currentTime = Date.now()
      if (docSnap.exists()) {
        due_time = docSnap.data().due_time
      } else {
        console.log("No such document!")
      }
      const loansRef = doc(db, "loans", this.loan.firebaseLoanId)
      if (due_time < currentTime) {
        await updateDoc(loansRef, {
          loan_status: "Overdue",
          return_time: null,
        })
      } else {
        await updateDoc(loansRef, {
          loan_status: "In progress",
          return_time: null,
        })
      }
      // update copy status
      const booksRef = doc(db, "books", this.loan.firebaseBookId)
      await updateDoc(booksRef, {
        copies: arrayRemove({
          inventoryNumber: this.loan.copyInvNumber,
          status: "Available",
        }),
      })
      await updateDoc(booksRef, {
        copies: arrayUnion({
          inventoryNumber: this.loan.copyInvNumber,
          status: "Loaned",
        }),
      })
      this.$emit("refresh")
      this.closeDialog()
    },
    deleteLoan() {},
  },
  computed: {
    loanIsFinished() {
      if (this.loan && this.loan.loan_status === "Finished") return true
      else return false
    },
  },
}
</script>

<style></style>
