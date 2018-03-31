<template>
    <div>
        <cv-checkbox-lists v-model="lists" :data="data" :is-relation="false" @current-change="handlerChange">
            <template slot="label" slot-scope="scope">
                {{scope.row.plateCode}}
            </template>
        </cv-checkbox-lists>
    </div>
</template>

<script>
export default {
    data() {
        return {
            lists: [],
            data: []
        }
    },
    watch: {
        lists(newVal) {
            console.log(newVal)
        }
    },
    created() {
        this.$http({
            url: '/monitor/getVehicleListByPlate',
            params: {
                onlineStatus: 2,
                current: 1,
                size: 10
            }
        }).then(mess => {
            const {data} = mess;
            this.data = data.records;
        })
    },
    methods: {
        handlerChange(mess) {
            
        }
    }
}
</script>

