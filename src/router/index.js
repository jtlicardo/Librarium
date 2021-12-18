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
    name: "Authentication",
    path: "/auth",
    component: UserAuth,
    meta: {
      needsUnauth: true,
      title: "Authentication",
    },
  },
  {
    path: "/",
    redirect: "/ubooks",
  },
  {
    name: "User Books",
    path: "/ubooks",
    component: UserBooks,
    meta: {
      needsAuth: true,
      title: "Books",
    },
  },
  {
    name: "User Reservations",
    path: "/ureservations",
    component: UserReservations,
    meta: {
      needsAuth: true,
      title: "Reservations",
    },
  },
  {
    name: "User Loans",
    path: "/uloans",
    component: UserLoans,
    meta: {
      needsAuth: true,
      title: "Loans",
    },
  },
  {
    name: "User Search",
    path: "/search",
    component: BookSearch,
    meta: {
      needsAuth: true,
      title: "Search",
    },
  },
  {
    name: "Book Details",
    path: "/:id",
    component: BookDetails,
    props: true,
    meta: {
      needsAuth: true,
      title: "Book Details",
    },
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Librarium`
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
