<template>
	<cv-tabs :titles="['hello', 'weixin']" height="200">
		<div>12</div>
		<div>22</div>
	</cv-tabs>
</template>	

<script>
import password from 'utils/password'

export default {
	beforeCreate() {
		this.$http({
			url: '/login',
			params: {
				enterpriseCode: 111111111,
				account: 'admin',
				password: password.$SHA512(password.$SHA512('123456')+'&admin'), 
				language: 'zh-cn'
			}
		}).then( mess => {
			const {data, flag} = mess;
			localStorage.setItem('token', data.token);
		})
	}
};
</script>

