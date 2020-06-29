import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from 'components/comment/Login'
const Login = () => import('components/comment/Login')
const Home = () => import('components/content/Home')

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
