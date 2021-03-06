import Vue from "vue"
import VueRouter from "vue-router"
import UserBooks from "@/views/user/UserBooks.vue"
import UserReservations from "@/views/user/UserReservations.vue"
import UserLoans from "@/views/user/UserLoans.vue"
import BookSearch from "@/views/user/BookSearch.vue"
import BookDetails from "@/views/BookDetails.vue"
import AuthPage from "@/views/AuthPage.vue"
import AdminBooks from "@/views/admin/AdminBooks.vue"
import AdminLoans from "@/views/admin/AdminLoans.vue"
import AdminAddLoan from "@/views/admin/AdminAddLoan.vue"
import AdminReservations from "@/views/admin/AdminReservations.vue"
import AdminRequests from "@/views/admin/AdminRequests.vue"
import AdminUsers from "@/views/admin/AdminUsers.vue"
import AccountInfo from "@/views/AccountInfo.vue"
import NotFound from "@/views/NotFound.vue"

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
    redirect: "/books",
  },
  {
    name: "User Books",
    path: "/books",
    component: UserBooks,
    meta: {
      needsAuth: true,
      needsUser: true,
      title: "Books",
    },
  },
  {
    name: "User Reservations",
    path: "/reservations",
    component: UserReservations,
    meta: {
      needsAuth: true,
      needsUser: true,
      title: "Reservations",
    },
  },
  {
    name: "User Loans",
    path: "/loans",
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
      backButton: true,
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
    name: "Add Loan",
    path: "/addloan",
    component: AdminAddLoan,
    meta: {
      needsAuth: true,
      needsAdmin: true,
      title: "Add Loan",
      hideMenu: true,
      hamburgerVisible: false,
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
    path: "/book/:id",
    component: BookDetails,
    props: true,
    meta: {
      needsAuth: true,
      title: "Book Details",
      backButton: true,
    },
  },
  {
    name: "Account Info",
    path: "/account/:id",
    component: AccountInfo,
    props: true,
    meta: {
      needsAuth: true,
      title: "Account Info",
    },
  },
  {
    name: "Not Found",
    path: "/:notFound(.*)",
    component: NotFound,
    meta: {
      needsAuth: true,
      title: "Not Found",
      hamburgerVisible: false,
      hideMenu: true,
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
  const isAuthenticated = !!currentUserEmail
  if (to.meta.needsAuth && !isAuthenticated) next("/auth")
  else if (to.meta.needsUnauth && !isAdmin && isAuthenticated) next("/books")
  else if (to.meta.needsUnauth && isAdmin && isAuthenticated) next("/adminbooks")
  else if (to.meta.needsAdmin && !isAdmin && isAuthenticated) next("/books")
  else if (to.meta.needsUser && isAdmin && isAuthenticated) next("/adminbooks")
  else next()
})

export default router
