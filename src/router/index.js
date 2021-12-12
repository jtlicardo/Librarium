import Vue from "vue"
import VueRouter from "vue-router"
import UserBooks from "@/views/UserBooks.vue"
import UserReservations from "@/views/UserReservations.vue"
import UserLoans from "@/views/UserLoans.vue"
import BookSearch from "@/views/BookSearch.vue"
import BookDetails from "@/views/BookDetails.vue"
import UserAuth from "@/views/UserAuth.vue"
import store from "@/store/index.js"

Vue.use(VueRouter)

const routes = [
  {
    name: "auth",
    path: "/auth",
    component: UserAuth,
    meta: {
      needsAuth: false,
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
  console.log("Promjena rute: ", from.name, " -> ", to.name)
  const currentUser = store.getters.currentUser
  console.log("Current user from router: ", currentUser)
  const authenticated = currentUser !== null
  if (!authenticated && to.meta.needsAuth) next("/auth")
  if (authenticated && !to.meta.needsAuth) next(false)
  next()
})

export default router
