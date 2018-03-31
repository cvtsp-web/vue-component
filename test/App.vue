<template>
	<el-container>
		<el-aside width="200px">
			<el-scrollbar>
				<router-link tag="li" class="cv-navitem" :to="list.path" v-for="list in lists" :key="list.name">
					{{list.name}}
				</router-link>
			</el-scrollbar>
		</el-aside>
		<el-main>
			<el-scrollbar class="cv-content">
				<router-view></router-view>
			</el-scrollbar>
		</el-main>
	</el-container>
</template>	

<script>
import menus from './menus'

export default {
	data() {
		return {
			lists: menus
		}
	}
};
</script>

<style lang="scss">
	.cv-navitem {
		cursor: pointer;
		list-style: none;
		display: block;
		height: 40px;
		color: #444;
		line-height: 40px;
		font-size: 14px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-weight: 400;
	}
	.router-link-active {
		color: #409eff;
	}
	.cv-content {
		position: absolute;
		top: 10px;
		bottom: 10px;
		width: 70%;
	}
</style>


