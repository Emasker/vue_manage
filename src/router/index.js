import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import("@/components/Login.vue")
    },
    {
      path: '/home',
      component: () => import("@/components/Home.vue"),
      redirect: '/welcome',
      children: [{
        path: '/welcome',
        component: () => import("@/components/Welcome.vue")
      }, {
        path: '/users',
        component: () => import("@/pages/user/Users.vue")
      }, {
        path: '/rights',
        component: () => import("@/pages/power/Rights.vue")
      },{
        path:"/roles",
        component:()=>import("@/pages/power/Roles.vue")
      },{
        path:'/categories',
        component:()=>import("@/pages/goods/Categories.vue")
      }]
    }
  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next()
})
export default router