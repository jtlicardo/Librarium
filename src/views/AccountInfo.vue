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
    <h2>
      <div class="info-label">STATUS</div>
      {{ userStatus }}
    </h2>
    <v-btn class="mt-14" color="red white--text" v-if="userStatus === 'user'">
      Delete account
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      displayName: "",
      isAdmin: null,
    }
  },
  methods: {
    getUserInfo() {
      const email = localStorage.getItem("userEmail")
      const displayName = localStorage.getItem("userFullname")
      const isAdmin = localStorage.getItem("userIsAdmin")
      this.email = email
      this.displayName = displayName
      this.isAdmin = isAdmin
    },
  },
  computed: {
    userStatus() {
      if (this.isAdmin === "true") return "admin"
      else return "user"
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
