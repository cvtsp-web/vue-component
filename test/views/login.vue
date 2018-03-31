<template>
    <el-form>
        <el-form-item label="登陆组件测试页面:">
            <el-button icon="el-icon-search" circle @click="login" :loading="loading"></el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import password from 'utils/password'

export default {
    data() {
        return {
            loading: false
        }
    },
    methods: {
        login() {
            this.loading = true;
            this.$http({
                url: '/login',
                params: {
                    enterpriseCode: 111111111,
                    account: 'admin',
                    password: password.$SHA512(password.$SHA512('123456')+'&admin'), 
                    language: 'zh-cn'
                }
            }).then( mess => {
                this.loading = true;
                const {data, flag} = mess;
                localStorage.setItem('token', data.token);
                this.$router.push('/tree');
            }).catch( _ =>{
                    this.loading = false
            })
        }
    }
}
</script>

