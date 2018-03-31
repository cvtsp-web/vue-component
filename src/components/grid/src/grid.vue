<template>
    <div class="cv-grid">
        <!-- table表格 -->
        <el-table :data="data" v-loading="loading">
            <slot></slot>
        </el-table>

        <!-- 分页器 -->
        <el-pagination :total="total" small 
        v-show="total == 0 ? false : true"
        class="cv-grid-pagination"
        layout="total, sizes, prev, pager, next" 
        background
        @current-change="handlerCurrentChange"
        @size-change="handlerSizeChange"
        :page-sizes="[10,20,30,40,50]" />
    </div>
</template>

<script>
import service from 'utils/service'

export default {
    name: 'CvGrid',
    props: {
        // 表格的api接口
        url: String,
        value: {},
        // 是否初始化加载表格
        isInitial: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            data: [],
            total: 0,
            loading: false,
            current: 1,
            size: 10
        }
    },
    mounted() {
        this.isInitial && this.tableInitial();
    },
    methods: {
        /**
         * 表格的加载方法
         * @param {Boolean} repeat true:表格重新加载，size重置10，current重置1
         */
        async tableInitial(repeat=true) {
            const params = {
                current: repeat ? 1 : this.current,
                size: repeat ? 10 : this.size,
                ...this.value
            };

            try {
                this.loading = true;
                const { data, flag } = await this.$http({
                    url: this.url,
                    params
                });
                this.loading = false;

                if(flag && service.isObject(data) && Array.isArray(data.records)) {
                    this.data = data.records;
                    this.total = data.total;
                }else {
                    this.data = [];
                    this.total = 0;
                }
            }
            catch(e) {
                this.loading = false;
            }
        },

        /**
         * currentPage 改变时会触发
         * @param {Number} page: 当前页currentPage
         */
        handlerCurrentChange(page) {
            this.current = page;
            this.tableInitial(false);
        },  

        /**
         * pageSize 改变时会触发
         * @param {Number} size: 页条数size
         */
        handlerSizeChange(size) {
            this.size = size;
            this.tableInitial(false);
        }
    }
}
</script>

<style lang="scss">
    .cv-grid {
        .cv-grid-pagination {
            margin-top: 5px;
            text-align: right;
        }
    }
</style>


