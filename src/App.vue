<template>
  <v-app>
    <sidebar-nav v-if="showSidebar"></sidebar-nav>
    <the-header v-if="showHeader"></the-header>
    <v-main :class="{ authbg: showAuthBg }">
      <v-container fluid>
        <transition :name="transitionName" mode="out-in">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>
    <base-dialog
      :title="baseDialog.title"
      :text="baseDialog.text"
      :color="baseDialog.color"
      :loading="baseDialog.loading"
      :active="baseDialog.active"
      @close="closeBaseDialog"
    ></base-dialog>
    <error-popup
      :active="errorPopup.active"
      :text="errorPopup.text"
      @close-dialog="closeErrorPopup"
    />
    <loading-dialog
      :active="loadingDialog.active"
      :title="loadingDialog.title"
    ></loading-dialog>
    <logout-dialog :active="logoutDialogActive"></logout-dialog>
    <v-snackbar content-class="text-center" v-model="snackbarActive" timeout="2000">
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>

<script>
import SidebarNav from "@/components/nav/SidebarNav.vue"
import TheHeader from "@/components/header/TheHeader.vue"
import BaseDialog from "@/components/ui/BaseDialog.vue"
import ErrorPopup from "@/components/ui/ErrorPopup.vue"
import LoadingDialog from "@/components/ui/LoadingDialog.vue"
import LogoutDialog from "@/components/LogoutDialog.vue"
import {
  getAuth,
  onAuthStateChanged,
  db,
  collection,
  getDocs,
  query,
  where,
} from "@/firebase.js"
import store from "@/store/index.js"

async function userIsAdmin(userId) {
  const users = collection(db, "users")
  const q = query(users, where("uid", "==", userId), where("isAdmin", "==", true))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.empty === true) return false
  else return true
}

const auth = getAuth()
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid
    const fullname = user.displayName
    const email = user.email
    userIsAdmin(uid)
      .then((result) => {
        console.log("Auth state change: ", email)
        store.dispatch("setUser", {
          uid: uid,
          email: email,
          fullname: fullname,
          isAdmin: result,
        })
      })
      .catch((e) => {
        console.log("onAuthStateChanged error: ", e)
      })
  } else {
    console.log("Auth state change, no user.")
  }
})

export default {
  components: {
    SidebarNav,
    TheHeader,
    BaseDialog,
    ErrorPopup,
    LoadingDialog,
    LogoutDialog,
  },
  data() {
    return {
      transitionName: null,
      showAuthBg: false,
      showHeader: false,
      errorPopupActive: false,
      errorPopupText: "",
    }
  },
  computed: {
    showSidebar() {
      const curRoute = this.$route.path
      if (curRoute === "/auth") return false
      else return true
    },
    showAuthBackground() {
      const curRoute = this.$route.path
      if (curRoute === "/auth") return true
      else return false
    },
    snackbarActive: {
      get: function () {
        return this.$store.getters.snackbarActive
      },
      set: function (newValue) {
        this.$store.dispatch("displaySnackbar", { text: "", isActive: newValue })
      },
    },
    snackbarText() {
      return this.$store.getters.snackbarText
    },
    errorPopup() {
      return this.$store.getters.errorPopup
    },
    baseDialog() {
      return this.$store.getters.baseDialog
    },
    loadingDialog() {
      return this.$store.getters.loadingDialog
    },
    logoutDialogActive() {
      return this.$store.getters.logoutDialog.active
    },
  },
  methods: {
    showAuthBgDelayed() {
      setTimeout(() => {
        this.showAuthBg = true
        this.showHeader = false
      }, 2000)
    },
    closeErrorPopup() {
      this.$store.dispatch("displayErrorPopup", {
        text: "",
        isActive: false,
      })
    },
    closeBaseDialog() {
      setTimeout(() => {
        this.$store.dispatch("displayBaseDialog", {
          text: "",
          title: "",
          color: "",
          loading: false,
          active: false,
        })
      }, 500)
    },
  },
  watch: {
    $route(to, from) {
      if (from.path === "/auth") {
        this.showAuthBg = false
        this.showHeader = true
      }
      if (to.path === "/auth") {
        this.transitionName = "logoutfade"
        this.showAuthBgDelayed()
      } else this.transitionName = "fade"
    },
  },
  mounted() {
    if (this.showAuthBackground) {
      this.showAuthBg = true
      this.showHeader = false
    } else {
      this.showAuthBg = false
      this.showHeader = true
    }
  },
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+Antique:wght@300;400;500;700;900&display=swap");

* {
  font-family: "Zen Kaku Gothic Antique", sans-serif;
}

.authbg {
  background-image: url("./assets/authbackground.jpg");
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-out;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.logoutfade-leave-active {
  transition: all 2s ease-out;
}

.logoutfade-enter-active {
  transition: all 0.3s ease-out;
}

.logoutfade-enter,
.logoutfade-leave-active {
  opacity: 0;
}
</style>
