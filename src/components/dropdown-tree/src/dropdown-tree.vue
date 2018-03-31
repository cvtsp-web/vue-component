<template>
    <div class="cv-dropdown-tree" v-clickoutside="handlerIstoggle">
        <el-input readonly clearable @click.native="isToggle=!isToggle" v-model="treeContent" />

        <!-- 下拉树 -->
        <transition name="el-zoom-in-top">
			<div class="dropdown-treearea" v-show="!readonly && isToggle">
				<el-input placeholder="搜索" class="dropdown-search" v-model="search" clearable />
				<el-scrollbar 
                    tag="ul"
                    wrap-class="el-select-dropdown__wrap"
                    view-class="el-select-dropdown__list" v-loading="treeLoading">
                    <cv-tree 
                    ref="tree"
                    :data="data ? data : treeData" 
                    :is-check="isCheck" 
                    :tree-loaded="handlerTreeLoaded"
                    @node-click="handlerNodeClick" />
                </el-scrollbar>
			</div>
		</transition>
    </div>
</template>

<script>
import CvTree from 'components/tree'
import service from 'utils/service'

/**
 * 目前只支持同步加载
 * 异步树暂不支持，尽情期待
 */
export default {
    name: 'CvDropdownTree',
    props: {
        // 文本内容(目前默认id值)
        value: {},
        // 需要的信息值
        label: {},
        // 是否只读
        readonly: {
            type: Boolean,
            default: false
        },
        // 接口方式
        url: String,
        // 数据方式
        data: Array,
        // 需要请求的参数
        autoParams: {
            type: Object,
            default() {return {} }
        },
        // 是否初始化加载数据(默认加载)
        isInitial: {
            type: Boolean,
            default: true
        },
        // 是否多选还是单选
        isCheck: Boolean
    },
    watch: {
        value: {
            immediate: true,
            handler(newVal) {
                if(newVal && this.$refs['tree']) {     
                    this.accordValueFindNode(newVal);
                }
            }
        },
        // 此块逻辑可能针对车组树
        autoParams(val) {
            // 先清空重置
            this.treeContent = '';

            // key-value中存在undefined不发请求（此个场景出现公司输入清空）
            if(this.eachAutoParamsIsExistValue(this.autoParams)) {
                // 清空已选项
               this.treeContent = '';
               // 数据清空
               this.treeData = [];
            }else {
                 this.treeRequestType();
            }  
        },
        // 监听文本为空
        treeContent(val) {
            val == '' && this.accordValueFindNode(val);
        }
    },
    data() {
        return {
            treeData: [],
            treeContent: '',
            search: "",
            isToggle: false,
            treeLoading: false
        }
    },
    mounted() {
        // 数据方式不存在的情况下 并且初始化同意
        if(!this.data && this.isInitial) {
            this.treeRequestType();
        }
    },
    methods: {
        /**
         * 点击文本以外的区域隐藏下拉树
         */
        handlerIstoggle() {
            this.isToggle = false;
        },

        /**
         * 下拉树的点击事件
         * @param {Object} node: 点击的节点信息
         */
        handlerNodeClick(node) {
            this.isToggle = false;
            this.accordValueFindNode(node.id);
        },

        /**
         * 树的数据渲染完成的回调
         * @param {Array} data: 回调的所有数据
         */
        handlerTreeLoaded(data) {
            if(this.value && this.$refs['tree']) {
                 this.accordValueFindNode(this.value);
            }
        },
        
        /**
         * 根据v-model(默认id)查找已存在的节点数据
         * @param {String} key: id
         */
        accordValueFindNode(key) {
            const _treeMethods = this.$refs['tree'];
            const nodes = _treeMethods.getNodeByParam('id', key);

            if(nodes && typeof nodes === 'object') {
                // 更新当前的text显示和当前的node节点信息
                this.$emit('update:label', nodes);
                this.$emit('input', nodes.id);
                _treeMethods.selectNode(nodes);
                this.treeContent = nodes.text;
            }else {
                // 当前没有选择的节点 清空所有值(默认为null)
                this.$emit('update:label', {});
                this.$emit('input', null);
                _treeMethods.cancelSelectedNode();
            }
        },

        /**
         * 树的http接口方式
         */
        async treeRequestType() {
            this.treeLoading = true;
            const {data, flag} = await this.$http({
                url: this.url,
                params: this.autoParams
            });
            this.treeLoading = false;

            if(flag && data) {
                this.treeData = data;
            }else {
                this.treeData = [];
            }
        },

        /**
         * 遍历autoParams 是否存在key value值
         * @param {Object} params: {}
         * @return {Boolean} true: 存在key-value
         */
        eachAutoParamsIsExistValue(params) {
            var keys = Object.keys(params);
            
            if(keys.length === 0) return false;

            for(let i = 0, len=keys.length; i<len; i++) {
                if(params[keys[i]] === undefined) {
                     return true;
                 }
            }
            return false;
        }
    }
}
</script>

<style lang="scss">
    @import '../../../theme/color/index.scss';
    .cv-dropdown-tree {
        position: relative;
        display: inline-block;
        .dropdown-treearea {
            position: absolute;
            top: 100%;
            z-index: 1;
			margin-top: 5px;
			border-radius: 2px;
			width: 100%;
			max-height: 336px;
			background: #fff;
			border: 1px solid $lightGray;
			box-shadow: $box-shadow;
        }
        .dropdown-search {
            width: 92%;
            margin: 5px 4%;
        }
    }
</style>


