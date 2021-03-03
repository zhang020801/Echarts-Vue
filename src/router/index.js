import Vue from 'vue'
import VueRouter from 'vue-router'

const SellerPage = () => import('../views/SellerPage')
const TrendPage = () => import('../views/TrendPage')
Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    component: SellerPage
  },
  {
    path: '/trendpage',
    component: TrendPage
  }
]

const router = new VueRouter({
  routes
})

export default router
