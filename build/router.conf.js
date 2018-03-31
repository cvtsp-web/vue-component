var render = require('json-templater/string')
var fs = require('fs')
var path = require('path')
var endLine = require('os').EOL;

// write in router file
var ROOT = path.resolve(__dirname, '../test/router.js');
var MENUS_ROOT = path.resolve(__dirname, '../test/menus.js');
var ROUTER_ROOT = path.resolve(__dirname, '../test/views');
var MENUS_LISTS = `{name: 'Cv-{{name}}', path: '/{{name}}'}`;
var MENUS_TPL = `
export default [
{{lists}}
]
`;
var ROUTER_LISTS = `{
    name: '{{name}}',
    path: '/{{name}}',
    component: (resolve) => require(['./views/{{name}}.vue'], resolve)
}`;
var ROUTER_TPL = `
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
{{lists}}
]
})
`;

var routerLists = [];
var menusLists = [];
var routers = fs.readdirSync(ROUTER_ROOT).map(router => {
    return router.split('.')[0];
});
routers.forEach(router => {
    routerLists.push(render(ROUTER_LISTS, {
        name: router
    }));
    menusLists.push(render(MENUS_LISTS, {
        name: router
    }))
});

var template = render(ROUTER_TPL, {
    lists: routerLists.join(',' + endLine)
});
var menusTemplate = render(MENUS_TPL, {
    lists: menusLists.join(',' + endLine)
})
fs.writeFileSync(ROOT, template);
fs.writeFileSync(MENUS_ROOT, menusTemplate);