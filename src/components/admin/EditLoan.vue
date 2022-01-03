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
                @click="activateLoan"
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
import { db, doc, updateDoc } from "@/firebase.js"

export default {
  props: ["active", "loan"],
  emits: ["close-dialog", "finished", "deleted"],
  methods: {
    closeDialog() {
      this.$emit("close-dialog")
    },
    async finishLoan() {
      const loansRef = doc(db, "loans", this.loan.firebaseLoanId)
      await updateDoc(loansRef, {
        loan_status: "Finished",
      })
      this.$emit("finished")
    },
    activateLoan() {},
    deleteLoan() {},
  },
  computed: {
    loanIsFinished() {
      if (this.loan.loan_status === "Finished") return true
      else return false
    },
  },
}
</script>

<style></style>
