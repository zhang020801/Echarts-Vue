import Vue from 'vue'
import VueRouter from 'vue-router'

const SellerPage = () => import('../views/SellerPage')
const TrendPage = () => import('../views/TrendPage')
const MapPage = () => import('../views/MapPage')
const RankPage = () => import('../views/RankPage')
const HotPage = () => import('../views/HotPage')
const StockPage = () => import('../views/StockPage')
const ScreenPage = () => import('../views/ScreenPage')
Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    component: SellerPage
  },
  {
    path: '/trendpage',
    component: TrendPage
  },
  {
    path: '/mappage',
    component: MapPage
  },
  {
    path: '/rankpage',
    component: RankPage
  },
  {
    path: '/hotpage',
    component: HotPage
  },
  {
    path: '/stockpage',
    component: StockPage
  },
  {
    path: '/',
    redirect: '/screen'
  },
  {
    path: '/screen',
    component: ScreenPage
  }
]

const router = new VueRouter({
  routes
})

export default router
