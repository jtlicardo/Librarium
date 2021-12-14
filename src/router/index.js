import Vue from "vue"
import VueRouter from "vue-router"
import UserBooks from "@/views/UserBooks.vue"
import UserReservations from "@/views/UserReservations.vue"
import UserLoans from "@/views/UserLoans.vue"
import BookSearch from "@/views/BookSearch.vue"
import BookDetails from "@/views/BookDetails.vue"
import UserAuth from "@/views/UserAuth.vue"

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
  const currentUserEmail = localStorage.getItem("currentUserEmail")
  const isAuthenticated = !!currentUserEmail
  if (to.meta.needsAuth && !isAuthenticated) next("/auth")
  else if (to.meta.needsUnauth && isAuthenticated) next("/ubooks")
  else next()
  console.log(
    "Route change: ",
    from.name,
    " -> ",
    to.name,
    "/ User authenticated? ",
    isAuthenticated
  )
})

export default router
