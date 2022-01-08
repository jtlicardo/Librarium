<template>
  <v-row justify="center">
    <v-dialog v-model="active" persistent width="400px">
      <v-card>
        <v-card-title></v-card-title>
        <v-card-subtitle>
          <h3 class="text-center mt-5">Are you sure you want to log out?</h3>
        </v-card-subtitle>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-btn color="gray darken-1" class="px-4 mx-auto" text @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn color="red white--text" class="px-4 mx-auto" @click="logout">
            Log out
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { getAuth, signOut } from "firebase/auth"

export default {
  props: ["active"],
  methods: {
    closeDialog() {
      this.$store.dispatch("toggleLogoutDialog")
    },
    timeout(miliseconds) {
      return new Promise((resolve) => setTimeout(resolve, miliseconds))
    },
    async logout() {
      const auth = getAuth()
      this.$store.dispatch("displayLoadingDialog", {
        active: true,
        title: "Logging you out...",
      })
      try {
        this.closeDialog()
        await signOut(auth)
        console.log("Logout successful!")
        this.$store.dispatch("setUser", {
          uid: null,
          email: null,
          fullname: null,
          isAdmin: null,
        })
        document.querySelector(".header").classList.add("hideheader")
        this.$router.replace("/auth")
        await this.timeout(2000)
        this.$store.dispatch("displaySnackbar", {
          text: "Logout successful!",
          isActive: true,
        })
      } catch (e) {
        console.log("Logout error", e)
      }
      this.$store.dispatch("displayLoadingDialog", {
        active: false,
        title: "",
      })
    },
  },
}
</script>
