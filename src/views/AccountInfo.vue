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
    <h2 class="mb-5" v-if="user">
      <div class="info-label">AUTHENTICATION METHOD</div>
      <v-img
        v-if="authMethod === 'google'"
        src="@/assets/google.png"
        max-width="40px"
        class="mx-auto mt-4"
      ></v-img>
      <v-icon v-else large class="mx-auto mt-3">mdi-email</v-icon>
    </h2>
    <p v-if="hasLoansOrReservations" class="mt-10">
      You currently cannot delete your account because you have at least one active loan
      or reservation.
    </p>
    <v-btn
      class="mt-14 mb-10"
      color="red white--text"
      v-if="user && userStatus === 'user' && !hasLoansOrReservations"
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
import {
  db,
  collection,
  query,
  where,
  getDocs,
  getAuth,
  doc,
  getDoc,
} from "@/firebase.js"
import DeleteAccount from "@/components/user/DeleteAccount.vue"

export default {
  props: ["id"],
  components: {
    DeleteAccount,
  },
  data() {
    return {
      dialogActive: false,
      user: null,
      userDocumentId: "",
      email: "",
      displayName: "",
      isAdmin: null,
      loans: [],
      activeLoans: [],
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
      const auth = getAuth()
      this.user = auth.currentUser
    },
    async checkUserLoans(loanIds) {
      for (let id of loanIds) {
        const docRef = doc(db, "loans", id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          if (docSnap.data().loan_status !== "Finished") this.activeLoans.push(id)
        } else {
          console.log("No such document!")
        }
      }
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
      if (this.isAdmin) return "admin"
      else return "user"
    },
    numOfReservations() {
      return this.reservations.length
    },
    numOfLoans() {
      return this.activeLoans.length
    },
    hasLoansOrReservations() {
      if (this.numOfReservations > 0 || this.numOfLoans > 0) return true
      else return false
    },
    authMethod() {
      if (this.user && this.user.providerData[0].providerId === "google.com")
        return "google"
      else return "email"
    },
  },
  async created() {
    await this.getUserInfo()
    await this.checkUserLoans(this.loans)
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
