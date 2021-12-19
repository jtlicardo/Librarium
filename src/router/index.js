import Vue from "vue"
import VueRouter from "vue-router"
import UserBooks from "@/views/user/UserBooks.vue"
import UserReservations from "@/views/user/UserReservations.vue"
import UserLoans from "@/views/user/UserLoans.vue"
import BookSearch from "@/views/user/BookSearch.vue"
import BookDetails from "@/views/user/BookDetails.vue"
import AuthPage from "@/views/AuthPage.vue"
import AdminBooks from "@/views/admin/AdminBooks.vue"
import AdminLoans from "@/views/admin/AdminLoans.vue"
import AdminReservations from "@/views/admin/AdminReservations.vue"
import AdminRequests from "@/views/admin/AdminRequests.vue"
import AdminUsers from "@/views/admin/AdminUsers.vue"

Vue.use(VueRouter)

const routes = [
  {
    name: "Authentication",
    path: "/auth",
    component: AuthPage,
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
      needsUser: true,
      title: "Books",
    },
  },
  {
    name: "User Reservations",
    path: "/ureservations",
    component: UserReservations,
    meta: {
      needsAuth: true,
      needsUser: true,
      title: "Reservations",
    },
  },
  {
    name: "User Loans",
    path: "/uloans",
    component: UserLoans,
    meta: {
      needsAuth: true,
      needsUser: true,
      title: "Loans",
    },
  },
  {
    name: "User Search",
    path: "/search",
    component: BookSearch,
    meta: {
      needsAuth: true,
      needsUser: true,
      title: "Search",
    },
  },
  {
    name: "Admin Books",
    path: "/adminbooks",
    component: AdminBooks,
    meta: {
      needsAuth: true,
      needsAdmin: true,
      title: "Books",
    },
  },
  {
    name: "Admin Loans",
    path: "/adminloans",
    component: AdminLoans,
    meta: {
      needsAuth: true,
      needsAdmin: true,
      title: "Loans",
    },
  },
  {
    name: "Admin Requests",
    path: "/adminrequests",
    component: AdminRequests,
    meta: {
      needsAuth: true,
      needsAdmin: true,
      title: "Requests",
    },
  },
  {
    name: "Admin Reservations",
    path: "/adminreservations",
    component: AdminReservations,
    meta: {
      needsAuth: true,
      needsAdmin: true,
      title: "Reservations",
    },
  },
  {
    name: "Admin Users",
    path: "/adminusers",
    component: AdminUsers,
    meta: {
      needsAuth: true,
      needsAdmin: true,
      title: "Users",
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
  const currentUserEmail = localStorage.getItem("userId")
  const userIsAdmin = localStorage.getItem("userIsAdmin")
  const isAdmin = userIsAdmin === "true"
  console.log("Router - user is admin? (boolean)", isAdmin)
  const isAuthenticated = !!currentUserEmail
  console.log("Router - user is admin? (string)", userIsAdmin)
  if (to.meta.needsAuth && !isAuthenticated) next("/auth")
  else if (to.meta.needsUnauth && !isAdmin && isAuthenticated) next("/ubooks")
  else if (to.meta.needsUnauth && isAdmin && isAuthenticated) next("/adminbooks")
  else if (to.meta.needsAdmin && !isAdmin && isAuthenticated) next("/ubooks")
  else if (to.meta.needsUser && isAdmin && isAuthenticated) next("/adminbooks")
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
