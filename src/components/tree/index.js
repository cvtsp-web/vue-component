import CvTree from './src/tree.vue'

CvTree.install = function(Vue) {
    Vue.component(CvTree.name, CvTree);
}

export default CvTree;