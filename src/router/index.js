import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import ErrorPage from '@/components/ErrorPage'
import IndexPage from '@/components/IndexPage'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path:'/',
      redirect:'login'
    },
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
});
router.beforeEach(({name},from,next)=>{
  console.log(localStorage)
  if (localStorage.JWT_TOKEN) {
    if (name == 'login') {
      next('/');
    } else {
      next();
    }
  } else {
    if (name == 'login') {
      next();
    } else {
      next({name: 'login'});
    }
  }
})
export default router;