
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

export default new Router({
routes: [
{
    path: '/',
    redirect: '/login',
    component: (resolve) => require(['./views/login.vue'], resolve)
},
{
    name: 'checkbox-lists',
    path: '/checkbox-lists',
    component: (resolve) => require(['./views/checkbox-lists.vue'], resolve)
},
{
    name: 'dropdown-tree',
    path: '/dropdown-tree',
    component: (resolve) => require(['./views/dropdown-tree.vue'], resolve)
},
{
    name: 'grid',
    path: '/grid',
    component: (resolve) => require(['./views/grid.vue'], resolve)
},
{
    name: 'login',
    path: '/login',
    component: (resolve) => require(['./views/login.vue'], resolve)
},
{
    name: 'tree',
    path: '/tree',
    component: (resolve) => require(['./views/tree.vue'], resolve)
}
]
})
