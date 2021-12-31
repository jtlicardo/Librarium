<template>
  <div class="text-center mt-14">
    <h1 class="mb-10">Account info</h1>
    <h2 class="mb-5">
      <div class="info-label">DISPLAY NAME</div>
      {{ displayName }}
    </h2>
    <h2 class="mb-5">
      <div class="info-label">EMAIL</div>
      {{ email }}
    </h2>
    <h2 class="mb-5">
      <div class="info-label">STATUS</div>
      {{ userStatus }}
    </h2>
    <h2 class="mb-5">
      <div class="info-label">NUMBER OF RESERVATIONS</div>
      {{ numOfReservations }}
    </h2>
    <h2 class="mb-5">
      <div class="info-label">NUMBER OF LOANS</div>
      {{ numOfLoans }}
    </h2>
    <p v-if="hasLoansOrReservations">
      You currently cannot delete your account because you have at least one active loan
      or reservation.
    </p>
    <v-btn
      class="mt-14"
      color="red white--text"
      v-if="userStatus === 'user' && !hasLoansOrReservations"
      @click="openDialog"
    >
      Delete account
    </v-btn>
    <delete-account
      :active="dialogActive"
      :docId="userDocumentId"
      @close-dialog="closeDialog"
    ></delete-account>
  </div>
</template>

<script>
import { db, collection, query, where, getDocs } from "@/firebase.js"
import DeleteAccount from "@/components/user/DeleteAccount.vue"

export default {
  props: ["id"],
  components: {
    DeleteAccount,
  },
  data() {
    return {
      dialogActive: false,
      userDocumentId: "",
      email: "",
      displayName: "",
      isAdmin: null,
      loans: [],
      reservations: [],
    }
  },
  methods: {
    async getUserInfo() {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("uid", "==", this.id))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        this.userDocumentId = doc.id
        this.email = doc.data().email
        this.displayName = doc.data().fullname
        this.isAdmin = doc.data().isAdmin
        this.loans = doc.data().loans
        this.reservations = doc.data().reservations
      })
    },
    openDialog() {
      this.dialogActive = true
    },
    closeDialog() {
      this.dialogActive = false
    },
  },
  computed: {
    userStatus() {
      if (this.isAdmin === "true") return "admin"
      else return "user"
    },
    numOfReservations() {
      return this.reservations.length
    },
    numOfLoans() {
      return this.loans.length
    },
    hasLoansOrReservations() {
      if (this.numOfReservations > 0 || this.numOfLoans > 0) return true
      else return false
    },
  },
  created() {
    this.getUserInfo()
  },
}
</script>

<style scoped>
h2 {
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.3rem;
}

.info-label {
  font-weight: 700;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.9rem;
}
</style>
