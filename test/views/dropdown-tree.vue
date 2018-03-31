<template>
    <div>
        <h2>走接口下拉树</h2>
        <cv-dropdown-tree 
        url="/enterprise/getEnterpriseTreeList" 
        v-model="tree1"
        :label.sync="label"></cv-dropdown-tree>

        <cv-dropdown-tree
        url="/fleet/findFleetInfoList"
        :is-initial="false"
        v-model="tree2"
        :auto-params="{enterpriseId: label.id}"
        ></cv-dropdown-tree>
        
        <h2>数据直接渲染</h2>
        <cv-dropdown-tree v-model="tree3" :data="data"></cv-dropdown-tree>
        <el-button @click="show">enter</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tree1: '',
            tree2: '',
            label: '',
            data: [],
            tree3: ''
        }
    },
    watch: {
        
    },
    mounted() {
        // this.$http({
        //     url: "/enterprise/getEnterpriseTreeList"
        // }).then(mess => {
        //     this.data = mess.data;
        // })
    },
    methods: {
        show() {
            console.log(this.tree1)
            console.log(this.tree2)
        }
    }
}
</script>

