<template>
    <div>
        <el-form inline>
            <el-form-item label="车牌号:"><el-input v-model="grids.plateCode" /></el-form-item>
            <el-form-item label="联系人:"><el-input v-model="grids.contactName" /></el-form-item>
            <el-form-item label="手机号:"><el-input v-model="grids.phoneNumber" /></el-form-item>
            <el-form-item><el-button type="primary" @click="search">搜索</el-button></el-form-item>
        </el-form>
        <cv-grid v-model="grids" url="/phonebook/getPhonebookPage" :is-initial="true" ref="table">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="车牌号码" prop="plateCode" :show-overflow-tooltip="true" />
            <el-table-column label="联系人" prop="contactName" :show-overflow-tooltip="true" />
            <el-table-column label="手机号码" prop="phoneNumber" :show-overflow-tooltip="true" />
            <el-table-column label="呼叫状态" prop="callStatus" :show-overflow-tooltip="true" />
            <el-table-column label="是否发送" prop="isSend" :show-overflow-tooltip="true" />
        </cv-grid>
    </div>
</template>

<script>
export default {
    data() {
        return {
            grids: {
                vehicleId: null,
                plateCode: null,
                contactName: null,
                phoneNumber: null
            }
        }
    },
    methods: {
        search() {
            this.$refs['table'].tableInitial();
        }
    }
}
</script>

