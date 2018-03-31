<template>
    <el-checkbox-group v-model="checkboxLists" @change="handlerCheckboxGroup" class="cv-checkboxgroup">
        <div class="emptytext" v-show="data.length > 0 ? false : true" style="font-size:16px">{{emptyText}}</div>

        <!-- 列表区域 -->
        <li v-for="(item, index) in data" :key="index" class="cv-checkboxgroup-item" v-show="data.length > 0 ? true : false">
            <!-- checkbox关联文本区域 -->
            <el-checkbox @change="handlerChange($event, item)" :label="item[props.label]" 
            :class="[isRelation ? '' : 'norelationCheckbox', 'cv-relation']">
                <slot name="label" :row="item" v-if="isRelation" />
            </el-checkbox>
            <!-- checkbox无关联文本区域 -->
            <span class="cv-noreleation">
                <slot name="label" :row="item" v-if="!isRelation" />
            </span>
            <!-- 操作区域 -->
            <slot name="operation" :row="item" />
        </li>
    </el-checkbox-group> 
</template>

<script>
export default {
    name: 'CvCheckboxLists',
    props: {
        // 已勾选的数据
        checkedData: {
            type: Array,
            default() {return [] }
        },
        // 接受的数据
        data: {
            type: Array,
            default() { return [] }
        },
        // 配置选项
        props: {
            type: Object,
            default() {
                return {
                    label: 'id' 
                }
            }
        },
        // 点击文字是否与checkbox关联
        isRelation: {
            type: Boolean,
            default: true
        },
        //内容为空的时候展示的文本
        emptyText: {
            type: String,
            default: '暂无数据'
        }
    },
    data() {
        return {
            checkboxLists: []
        }
    },
    created() {
        this.checkboxLists = this.checkedData;
    },
    watch: {
        checkedData(newVal) {
            this.checkboxLists = newVal;
        }
    },
    methods: {
        /**
         * 当绑定值变化时触发的事件
         * @param {Boolean} event: 是否勾选(true, false)
         * @param {Object} value: 当前的所有信息
         */
        handlerChange(event, value) {
            this.$emit('current-change', {
                name: event ? 'check' : 'cancel',
                data: [value]
            });
        },

        /**
         * 检测checkbox-group变化的触发事件
         * @param {Array} value: [勾选的]
         */
        handlerCheckboxGroup(value) {
            this.$emit('input', value);
        }
    }
}
</script>

<style lang="scss">
    .cv-checkboxgroup{
        $height: 36px;
        $font: 14px;
        min-height: $height;
        .emptytext {
            text-align: center;
            color: #ccc;
            height: $height;
        }
        .cv-checkboxgroup-item {
            list-style: none;
            height: $height;
            line-height: $height;
            border-bottom: 1px solid #dcdfe6;
            font-size: $font;
            .cv-relation {
                float: left;
            }
            .cv-noreleation {
                float: left;
                padding-left: 5px;
                color: #606266;
            }
        }
        .cv-checkbox-label {
            display: inline-block;
            font-size: $font;
        }
        .norelationCheckbox {
            width: 16px;
            overflow: hidden;
        }
    }
</style>

