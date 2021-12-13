import Vue from "vue"
import VueRouter from "vue-router"
import UserBooks from "@/views/UserBooks.vue"
import UserReservations from "@/views/UserReservations.vue"
import UserLoans from "@/views/UserLoans.vue"
import BookSearch from "@/views/BookSearch.vue"
import BookDetails from "@/views/BookDetails.vue"
import UserAuth from "@/views/UserAuth.vue"
import store from "@/store/index.js"
import { getAuth } from "@/firebase.js"

Vue.use(VueRouter)

const routes = [
  {
    name: "auth",
    path: "/auth",
    component: UserAuth,
    meta: {
      needsUnauth: true,
    },
  },
  {
    name: "all",
    path: "/",
    redirect: "/ubooks",
    meta: {
      needsAuth: true,
    },
  },
  {
    name: "ubooks",
    path: "/ubooks",
    component: UserBooks,
    meta: {
      needsAuth: true,
    },
  },
  {
    name: "ureservations",
    path: "/ureservations",
    component: UserReservations,
    meta: {
      needsAuth: true,
    },
  },
  {
    name: "uloans",
    path: "/uloans",
    component: UserLoans,
    meta: {
      needsAuth: true,
    },
  },
  {
    name: "search",
    path: "/search",
    component: BookSearch,
    meta: {
      needsAuth: true,
    },
  },
  {
    name: "bookdetails",
    path: "/:id",
    component: BookDetails,
    props: true,
    meta: {
      needsAuth: true,
    },
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  const currentUser = store.getters.currentUser
  const auth = getAuth()
  const firebaseCurrentUser = auth.currentUser
  console.log("Route change: ", from.name, " -> ", to.name, "Current user: ", currentUser)
  console.log("Current user from Firebase: ", firebaseCurrentUser)
  const authenticated = currentUser !== null
  if (!authenticated && to.meta.needsAuth) next("/auth")
  else if (authenticated && to.meta.needsUnauth) next("/ubooks")
  else next()
})

export default router
