<template>
    <div class="cv-tree" ref="tree" v-loading="treeLoading">
        <div class="cv-tree-emptytext" v-show="isEmptyText">暂无数据</div>

        <!-- 树的容器 -->
        <ul class="cv-ztree" ref="ztree" v-show="!isEmptyText"></ul>

        <!-- 右点击下拉框 -->
        <ul class="el-dropdown-menu el-popper" 
            v-if="isContextmenu" v-show="rightDropdown" :style="rightPosition">
            <slot name="dropdown" :api="zTree">
                <!-- <li tabindex="-1" class="el-dropdown-menu__item">黄金糕</li> -->
            </slot>
            <div x-arrow="" class="popper__arrow" style="left: 46px;"></div>
        </ul>
    </div>
</template>

<script>
import BaseTree from './base-tree'
import element from 'utils/element'

export default {
    name: 'CvTree',
    props: {
        // 同步树的所有数据 {data: [], async: url/false/null, initial: 'default/none'}
        data: {},
        // 树的异步接口(/monitor/findVehicleTreeInfoList)
        url: {
            type: String
        },
        lazy: {
            default: false
        },
        // 是否是多选还是单选模式 true(多选)
        isCheck: {
            type: Boolean,
            default: false
        },
        // 树上的节点图标筛选
        iconsFilter: {
            type: Function
        },
        // 树上的节点筛选 return [条件, 符合的结果]
        nodeFilter: {
            type: Array,
            default() {return [] }
        },
        // 是否开启右击功能
        isContextmenu: {
            type: Boolean,
            default: false
        },
        // 点击节点需要的节点参数
        autoParam: {
            type: Array,
            default() {
                return ['id', "type=type"];
            }
        },
        // 树接受数据加载完成的回调
        treeLoaded: Function
    },
    data() {
        return {
            tree: null,
            treeLoading: false,
            rightDropdown: false,
            rightPosition: {
                position: 'absolute',
                top: 0,
                left: 0
            },
            // zTree api
            zTree: {},
            isEmptyText: true
        }
    },
    computed: {
        _tree() {
            return this.$refs['tree'];
        },
        _ztree() {
            return this.$refs['ztree'];
        }
    },
    watch: {
        data: {
            immediate: true,
            handler(val) {
                if(Array.isArray(val) && val.length > 0) {
                    this.isEmptyText = false;
                    this.tree && this.tree.setInitialTree(val);
                }
            }
        }
    },
    methods: {
        /**
         * 右击显示下拉框事件
         * @param {Event} event: 事件源对象
         * @param {Number|String} treeId: 点击的节点id
         * @param {Object} treeNode: 点击的节点所有信息
         */
        rightCLickEvent(event, treeId, treeNode) {
            const target = element.delegation(event, 'A');

            if(target && this.isContextmenu) {
                this.rightDropdown = true;
                const {zTree} = this.tree;
                const {clientX, clientY} = event, {top, left} = this._tree.getBoundingClientRect();

                zTree.cancelSelectedNode();
                zTree.selectNode(treeNode);
                this.rightPosition = Object.assign(this.rightPosition, {
                    top: (this._tree.scrollTop + clientY - top) + 'px',
                    left: (clientX - left) + 'px'
                });

                this.zTree = zTree;
                this.zTree.currentNode = treeNode;
                this.$emit('right-click', treeNode);
            }
        },

        hideDropdown() {
            this.rightDropdown = false;
        },

        /**
         * 随意生成树的id编号
         */
        randomMakeTreeid() {
            const nowTime = new Date() * 1 + parseInt(Math.random() * 100000);
            var treeId = `tree${nowTime}`;
            this._ztree.id = treeId;

            return treeId;
        },

        /**
         * 异步树的初始化请求
         * @param {String} url: api接口路径
         */
        initialTree(url) {
            this.treeLoading = true;
            this.$http({ url }).then(mess => {
                this.treeLoading = false;
                const {data, flag} = mess;
                this.isEmptyText = false;

                flag && this.tree.initialTree(data);
            })
        },

        /**
         * 每次树异步成功请求返回的节点
         * @param {Object} treeNode: 节点信息
         * @param {String} handlerName: 当前异步的事件的名称(expand or check)
         */
        treeSuccessCallback(treeNode, handlerName) {
            const { zTree } = this.tree;
            
            if(handlerName == 'check') {
                this._asyncLoadChilds(treeNode);
            }
        },

        /**
         * 异步加载父节点下面的子节点
         * @param {Node} parentNode: 当前节点
         * @param {String} name: check/cancel
         */
        _asyncLoadChilds(parentNode, name='check') {
            var childs = parentNode.children;
            const {zTree} = this.tree;
            const condition = this.nodeFilter[0] ? this.nodeFilter[0] : 'checked';
            const result = this.nodeFilter[1] ? this.nodeFilter[1] : (name=='check' ? true : false);

            if(name == 'check') {
                childs && childs.forEach(child => {
                    zTree.checkNode(child, true, true);
                    !child.zAsync && zTree.reAsyncChildNodes(child, true, true);
                });
            }   
            
            var checkedChild = zTree.getNodesByParam(condition, result, parentNode);
            this.$emit('current-change', {
                name,
                data: checkedChild.length !== 0 ? checkedChild : []
            });
        },

        /**
         * checkbox勾选事件
         * @param {event}
         * @param {treeId}
         * @param {treeNode} 当前勾选的节点信息
         */
        handlerCheck(event, treeId, treeNode) {
            const { zTree } = this.tree;
            const {zAsync, checked, isParent} = treeNode;
            const condition = this.nodeFilter[0] ? this.nodeFilter[0] : 'checked';
            const result = this.nodeFilter[1] ? this.nodeFilter[1] : true;

            this.$emit('node-check', treeNode);
            if(!zAsync) {              
                // zAsync=false 表示还未进行异步加载--异步
                // arguments[0]节点  arguments[1]="refresh" 表示清空后重新加载
                zTree.reAsyncChildNodes(treeNode, true);
            }else {
                // zAsync=true 表示已经加载完成了--同步
                // 如果当前状态为父节点输出父节点和子节点／状态为不是父节点输出当前节点信息
                if(isParent) {
                    this._asyncLoadChilds(treeNode, checked ? 'check' : 'cancel');
                }else {
                    let checkedChild = treeNode[condition] == result ? [treeNode] : [];
                    // check勾选变化的回调函数
                    this.$emit('current-change', {
                        name: checked ? 'check' : 'cancel',
                        data: checkedChild
                    })
                }
            }
        },

        handlerClick(treeNode) {
            const {zTree} = this.tree;
            const condition = this.nodeFilter[0] ? this.nodeFilter[0] : 'checked';
            const result = this.nodeFilter[1] ? this.nodeFilter[1] : true;

            // 是否点击节点关联checkbox勾选
            if( condition && result && treeNode[condition] == result ) {
                zTree.checkNode(treeNode, true, true);
            }
            this.$emit('node-click', treeNode);
        },

        /**
         * 通过 keys 设置目前勾选的节点(默认为车辆id)
         * @param {Array} keys=[id, id, id]
         * @param {Boolean} isChecked 是否勾选还是取消
         * @param {Object} parentNode 该父节点下查找
         */
        setCheckedKeys(keys, isChecked=true, parentNode) {
            const { zTree } = this.tree;

            if(!Array.isArray(keys)) return new Error('keys is must be Array!!!');
            if(keys.length > 0) {
                keys.forEach( key => {
                    var node = zTree.getNodeByParam('id', key, parentNode);
                    node && zTree.checkNode(node, isChecked, true);
                })
            }else {
                // keys数组为空， 表示取消所有勾选
                zTree.checkAllNodes(false);
            }
        },

        /**
         * 获得当前根节点所有加载完成的节点
         */
        getAllNodes() {
            return this.tree.zTree.getNodes();
        },

        getCheckedNodes(isCheck=true) {
            return this.tree.zTree.getCheckedNodes(isCheck);
        },

        /**
         * 根据条件过滤符合的节点数组
         * @param {String} condition: 条件
         * @param {String} result: 筛选目标
         * @param {Node} parentNode: 父节点
         * @return {Array|null|Object} 有数据返回数据 否则为空
         */
        getNodeByParam(condition, result, parentNode) {
            const {zTree} = this.tree;
            return zTree.getNodeByParam.apply(this, arguments);
        },

        /**
         * 取消选中的节点
         * $param {treeNode} 当前选中的节点
         */
        cancelSelectedNode(treeNode) {
            const {zTree} = this.tree;
            return zTree.cancelSelectedNode(treeNode);
        },

        /**
         * 选中需要的节点
         * @param {Object} treeNode: 节点对象
         * @param {Boolean} addFlag: true:表示追加选中，会出现多点同时被选中的情况 false:表示单独选中，原先被选中的节点会被取消选中状态
         * @param {Boolean} isSilent:true: 选中节点时，不会让节点自动滚到到可视区域内;false:表示选中节点时，会让节点自动滚到到可视区域内 
         */
        selectNode(treeNode, addFlag=false, isSilent=false) {
            const {zTree} = this.tree;
            return zTree.selectNode.apply(this, arguments);   
        }
    },
    destoryed() {
        element.off(document, 'click', this.hideDropdown);
    },
    mounted() {
        const _this = this;
        element.on(document, 'click', this.hideDropdown);
        this.tree = new BaseTree({
            el: _this.randomMakeTreeid(), 
            options: {
                // 异步用url
                url: _this.url,
                // 同步用data
                data: _this.data,
                lazy: _this.lazy,
                isCheck: _this.isCheck,
                iconsFilter(nodes) {
                    var {data, flag} = nodes;

                    if(_this.iconsFilter && Array.isArray(data)) {
                        data.forEach(val => {
                            _this.iconsFilter(val);
                        });
                        return data;
                    };
                    return data;
                },
                autoParam: _this.autoParam
            },
            methods: {
                nodeClick(event, treeId, treeNode){
                    _this.handlerClick(treeNode);
                },
                nodeBeforeExpand(treeId, treeNode){
                    _this.$emit('node-before-expand', treeNode);
                },
                nodeExpand(event, treeId, treeNode) {
                    _this.$emit('node-expand', treeNode);
                },
                nodeCheck(event, treeId, treeNode) {
                    _this.handlerCheck(event, treeId, treeNode);
                },
                rightClick(event, treeId, treeNode) {
                   _this.rightCLickEvent(event, treeId, treeNode);
                },
                load(treeNode, handlerName) {
                    _this.treeSuccessCallback(treeNode, handlerName);
                },
                treeLoaded(data) {
                    typeof _this.treeLoaded === 'function' && _this.treeLoaded(data);
                }
            }
        });

        this.url && this.initialTree(this.url);  
        if(Array.isArray(this.data) && this.data.length > 0) {
            this.tree.setInitialTree(this.data);  
        } 
    }
}
</script>

<style lang="scss">
    .cv-tree {
       width: 100%;
       min-height: 36px;
       .cv-tree-emptytext {
           text-align: center;
           font-size: 16px;
           color: #ccc;
       }
    }
</style>


