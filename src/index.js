
/** auto(wukangjun) components */
import CvCheckboxLists from './components/checkbox-lists/index.js';
import CvDropdownTree from './components/dropdown-tree/index.js';
import CvFlyweight from './components/flyweight/index.js';
import CvGrid from './components/grid/index.js';
import CvRadioLists from './components/radio-lists/index.js';
import CvTabs from './components/tabs/index.js';
import CvTree from './components/tree/index.js';
import config from './utils/config.js'
import http from './utils/http.js'
import clickOutHide from './utils/clickoutside'

const components = [
CvCheckboxLists,
CvDropdownTree,
CvFlyweight,
CvGrid,
CvRadioLists,
CvTabs,
CvTree
];

const install = function(Vue, options={}) {
    components.map(component => {
        Vue.component(component.name, component);
    });

    Vue.prototype.$http = http;
    Vue.prototype.$config = config;

    Vue.directive('clickoutside', clickOutHide)
};

export default {
version: '1.0.1',
install,
CvCheckboxLists,
CvDropdownTree,
CvFlyweight,
CvGrid,
CvRadioLists,
CvTabs,
CvTree
};
