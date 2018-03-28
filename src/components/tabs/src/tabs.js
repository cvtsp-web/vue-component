import '../style/index.scss'
import {Tabs, TabPane, Scrollbar} from 'element-ui'

export default {
    name: 'CvTabs',
    components: {
        ElTabs: Tabs, 
        ElTabPane: TabPane, 
        ElScrollbar: Scrollbar
    },
    props: {
        titles: {
            type: [Function, Array],
            default() { return [] }
        },
        value: {},
        // 默认只渲染当前tab页
        forceRender: {
            type: [Boolean],
            default: true
        }
    },
    data() {
        return {
            defaultValue: this.detailDefaultValue(),
            tabsCache: {}
        }
    },
    created() {
        this.tabsCache = this.detailCache(this.defaultValue, this.forceRender);
    },
    computed: {
        _activeName() {
            return this.detailDefaultValue();
        }
    },
    render(h) {
        const childs = this.$slots.default.filter(child => {
            return child.tag;
        });
        const childItem = childs.map((child, index) => {
            return (
                <el-tab-pane name={'tabs' + index}>
                    <span slot="label">
                        { Array.isArray(this.titles) ? this.titles[index] : this.titles.call(this, h)[index] }
                    </span>
                    <el-scrollbar class="cv-tabs-scrollbar">
                        { this.tabsCache['tabs' + index] && child }
                    </el-scrollbar>
                </el-tab-pane>
            )
        })
        return (
            <el-tabs 
                class="cv-tabs"
                value={this._activeName} 
                onInput={this.handlerChange.bind(this)}>
                {childItem}
            </el-tabs>
        )
    },
    methods: {
        handlerChange(value) {
            this.tabsCache[value] = true;
            this.$emit('input', value);
            this.$emit('tab-click', value);
        },
        /**
         *  v-model 默认情况下的兼职处理
         *  如果外部的v-model没有传值，默认赋值(tabs0)
         *  @return {v-model}
         */
        detailDefaultValue() {
            return (!this.value || this.value == '') ? 'tabs0' : this.value;
        },

        /**
         * 将当前的activeName作为缓存(tabsCache)
         * @param {string} activeName: 点击的当前活动页键值
         * @param {Boolean} forceRender: 是否缓存所有tab(true只缓存当前tab页)
         * @return {Object} cacheLists: {tabs_0: true, tabs_1: false}
         */
        detailCache(activeName, forceRender) {
            var cacheLists = {};
            var titles = Array.isArray(this.titles) ? this.titles : this.titles.call(this);

            titles.forEach( (title, index) => {
                if(!forceRender) {
                    cacheLists['tabs' + index] = true;
                }else {
                    if(activeName.replace(/[^\d]/g, '') == index) {
                        cacheLists['tabs' + index] = true;
                    }else {
                        cacheLists['tabs' + index] = false;
                    }   
                }
            });
            return cacheLists;
        }
    }
}
