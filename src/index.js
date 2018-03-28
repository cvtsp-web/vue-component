
/** auto(wukangjun) components */
import Flyweight from './components/flyweight/index.js';
import Tabs from './components/tabs/index.js';
import Tree from './components/tree/index.js';
import config from './utils/config.js'
import http from './utils/http.js'

const components = [
Flyweight,
Tabs,
Tree
];

const install = function(Vue, options={}) {
    components.map(component => {
        Vue.component(component.name, component);
    });

    Vue.prototype.$http = http;
    Vue.prototype.$config = config;
};

export default {
version: '1.0.1',
install,
Flyweight,
Tabs,
Tree
};
