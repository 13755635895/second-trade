<template>
	<view class="layout me-fx-col">
		<!--顶部导航栏-->
		<u-navbar ref="navbar" v-if="navBarShow" :leftIcon="leftIcon" placeholder autoBack :title="title" :bgColor="bgColor" leftIconColor="#FFFFFF" titleStyle="color:#FFFFFF"/>
		<view class="me-fx-1 me-fx-col" :style="{'background':pageBackground}">
			<slot></slot>
		</view>
		<u-tabbar v-if="!leftIcon" :value="tabbarIndex" activeColor="#F25037" @change="change">
			<block v-for="item in tabbarList" :key="item.name">
				<u-tabbar-item :text="item.text" :icon="item.icon" :name="item.name"></u-tabbar-item>
			</block>
		</u-tabbar>
	</view>
</template>

<script>
	const app = getApp()
	import {
		mapGetters
	} from 'vuex';
	export default {
		name: 'layout',

		props: {
			navTitle: {
				type: String,
				default: ''
			},

			bgColor: {
				type: String,
				default: '#F25037'
			},
			pageBackground: {
				type: String,
				default: '#FFFFFF'
			},
			tabbarIndex: {
				type:String,
				default:''
			},
			navBarShow: {
				type:Boolean,
				default:true
			},
			tabbarShow: {
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				tabbarList: [{
						text: '首页',
						icon: 'home',
						name: 'home'
					},
					{
						text: '关注',
						icon: 'heart',
						name: 'heart'
					},
					{
						text: '发布',
						icon: 'plus',
						name: 'plus'
					},
				 {
						text: '发现',
						icon: 'eye',
					    name: 'eye'
					},
					{
						text: '我的',
						icon: 'account',
						name:'account'
					}
				]
			}
		},
		computed: {
          leftIcon() {
			return this.tabbarList.find(item=>item.name==this.tabbarIndex)||this.navTitle=='登录'?'':'arrow-left'
		  },
		  title() {
			 return this.navTitle?this.navTitle:this.tabbarList.find(item=>item.name==this.tabbarIndex).text
		  }
		},
		methods: {
           change(href) {
			   uni.navigateTo({
				  
			   	url:`/pages/${href}/${href}`
			   })
		   }
		}
	}
</script>

<style lang="scss" scoped>
	.layout {
		width: 100%;
		height: 100%;
	}
	/deep/.u-tabbar {
		flex: 0;
	}
</style>
