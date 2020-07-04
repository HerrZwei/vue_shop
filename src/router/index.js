import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from 'components/comment/Login'
const Login = () => import('components/comment/Login')
const Home = () => import('components/content/Home')
const WelCome = () => import('components/content/WelCome')
const Users = () => import('views/user/Users')
const Rights = () => import('views/power/Rights')
const Roles = () => import('views/power/Roles')
const Cate = () => import('views/goods/cate')
const Params = () => import('views/goods/Params')
const List = () => import('views/goods/List')
const Add = () => import('views/goods/Add')
const Order = () => import('views/order/Order')
const Report = () => import('views/report/Report')
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
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: WelCome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }]
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

// 拦截路由导航守卫

router.beforeEach((to, from, next) => {
  // to: 将要访问的路径
  // from: 代表从哪个路径跳转而来
  // next: 是一个函数， 表示放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('./login')
  next()
})
export default router
