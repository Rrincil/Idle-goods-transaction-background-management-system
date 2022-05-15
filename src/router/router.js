import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'

// 实现路由懒加载
const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const Welcome = () => import('../components/Welcome.vue')

const Users = () => import('../components/user/Users.vue')
const Rights = () => import('../components/power/Rights.vue')
const userinfo = () => import('../components/power/userinfo.vue')
const Cate = () => import('../components/goods/Cate.vue')
const Params = () => import('../components/goods/Params.vue')

const GoodsList = () => import('../components/goods/List.vue')
const Add = () => import('../components/goods/Add.vue')

const Order = () => import('../components/order/Order.vue')
const Report = () => import('../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/userinfo',
        component: userinfo
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: GoodsList
      },
      {
        path: '/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      },
      {
        path: '/userinfo',
        component: userinfo
      }]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to and from are Route Object,next() must be called to resolve the hook}
  // to将要访问的路径 from代表从哪个路径跳转而来
  // next 是一个函数，表示放行 next() 放行 next('/login') 强制跳转到登录页面
  // 如果是登录页，直接放行即可
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  if (to.path === '/goods/goods') return next('/goods')
  if (to.path === '/goods/params') return next('/params')
  if (to.path === '/goods/categories') return next('/categories')
  if (to.path === '/goods/userinfo') return next('/reports')
  if (to.path === '/goods/rights') return next('/rights')
  if (to.path === '/goods/orders') return next('/orders')
  if (to.path === '/goods/reports') return next('/reports')

  next()
})

export default router
