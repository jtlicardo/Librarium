import Vue from 'vue'
import VueRouter from 'vue-router'
import UserBooks from '../views/UserBooks.vue'
import UserReservations from "../views/UserReservations.vue"
import UserLoans from "../views/UserLoans.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/ubooks"
  },
  {
    path: '/ubooks',
    component: UserBooks
  },
  {
    path: '/ureservations',
    component: UserReservations
  },
  {
    path: "/uloans",
    component: UserLoans
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
