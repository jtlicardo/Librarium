<template>
  <v-row justify="center">
    <v-dialog v-model="active" persistent width="500px">
      <v-card>
        <v-card-title>
          <h2 class="mx-auto">Edit loan</h2>
        </v-card-title>
        <v-card-subtitle>
          <h3 class="text-center mt-10">
            Set the loan's status as 'finished' or delete the loan
          </h3>
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
              >
                Set as finished
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
export default {
  props: ["active", "loan"],
  emits: ["close-dialog", "finished", "deleted"],
  methods: {
    closeDialog() {
      this.$emit("close-dialog")
    },
  },
}
</script>

<style></style>
