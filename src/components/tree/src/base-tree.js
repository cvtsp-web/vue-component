import '../assets/css/awesome.scss'
import '../assets/jquery-1.4.4.min.js'
import '../assets/jquery.ztree.core'
import '../assets/jquery.ztree.excheck'
import '../assets/jquery.ztree.exedit'
import config from 'utils/config'

/**
 * inject[jquery, ztree]
 */
var defaultOptions = {
    el: null,
    options: {},
    methods: {}
};
export default class BaseTree {
    constructor(options) {
        const _self = this;

        this.zTree = null;
        this.treeId = options.el;
        this.el = $('#' + this.treeId);
        this._eachProperties(options.options);
        this._eachProperties(options.methods);

        // 当前的事件名称(expand or check)
        this.currentHandlerName = null;
    }

    /**
     * 初始化树的配置和方法
     * @param {Array} data: []
     */
    initialTree(data) {
        var data = this.iconsFilter({data});

        $.fn.zTree.init(this.el, this.treeConfig(this.isCheck), data);
        this.zTree = $.fn.zTree.getZTreeObj(this.treeId);
        this.treeLoaded(data);
    }

    /**
     * 设置初始化树
     * @param {Array} data
     */
    setInitialTree(data) {
        $.fn.zTree.init(this.el, this.treeConfig(this.isCheck), data);
        this.zTree = $.fn.zTree.getZTreeObj(this.treeId);
        this.treeLoaded(data);
    }

    /**
     * 设置树的配置
     * @param {Boolean} isCheck: 树是否单选和多选
     * @param {Boolean} isAsync: 树是否异步
     */
    treeConfig(isCheck) {
        const _self = this;

        return {
            data: {
                key: {name: 'text'},
                simpleData: { enable: true }
            },
            check: {
                enable: isCheck,
                nocheckInherit: true,
                chkStyle: "checkbox",
                chkboxType: { "Y": "ps", "N": "ps" }
            },
            view: {
                selectedMulti: true,
                showLine: false
            },
            async: {
                enable: _self.url ? true : (_self.lazy ? true : false),
                url: config.baseUrl + (_self.url ? _self.url : _self.lazy),
                autoParam: _self.autoParam ? _self.autoParam : ['id', "type=type"],
                otherParam: { 'token': localStorage.getItem('token') },
                dataFilter: function(treeId, parentNode, responseData) {
                    return _self.iconsFilter(responseData);
                },
                type: "post"
            },
            callback: {
                beforeExpand: function(treeId, treeNode) {
                    _self.currentHandlerName = 'expand';
                    _self.nodeBeforeExpand && _self.nodeBeforeExpand.apply(this, arguments);
                },
                beforeCheck: function(treeId, treeNode) {
                    _self.currentHandlerName = 'check';
                    _self.nodeBeforeCheck && _self.nodeBeforeCheck.apply(this, arguments);
                },
                onExpand: function(event, treeId, treeNode) {
                    _self.nodeExpand && _self.nodeExpand.apply(this, arguments);
                },
                onAsyncSuccess: function(event, treeId, treeNode, msg) {     
                    _self.load && _self.load(treeNode, _self.currentHandlerName);
                },
                onCheck: function(event, treeId, treeNode) {
                    _self.nodeCheck && _self.nodeCheck.apply(this, arguments);
                },
                onClick: function(event, treeId, treeNode) {
                    _self.nodeClick && _self.nodeClick.apply(this, arguments);
                },
                onRightClick: function(event, treeId, treeNode) {
                    _self.rightClick && _self.rightClick.apply(this, arguments);
                }
            } 
        }
    }

    /**
     * 将对象中的属性放到this对象上
     * @param {Object} properties 
     */
    _eachProperties(properties) {
        Object.keys(properties).forEach(property => {
            const value = properties[property];

            this[property] = value;
        })
    }
}