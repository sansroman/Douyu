import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import ErrorPage from '@/components/ErrorPage'
import IndexPage from '@/components/IndexPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },{
      path: '/error',
      name:'error',
      component: ErrorPage
    },
    {
      path:'/index',
      name:'index',
      component: IndexPage
    }

  ]
})
