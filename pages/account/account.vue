<template>
	<uni-clayout tabbarIndex="account">
		<view class="account-page">
			<view class="account-page_head">
				<view class="my-header-background"><image :src="userInfo.showAvatar" mode="aspectFill"></image></view>
				<view class="account-page_avatr me-fx-col-c-c" @click="toUser(userInfo.userId)">
					<image :src="userInfo.showAvatar" mode=""></image>
					<view>{{userInfo.nickName}}</view>
				</view>
				<view class="me-fx-row-sb account-page_detail">
					<view class="me-fx-col-c-c">
						<text class="" @click="toHeart">
							关注
						</text>
						<text>{{userInfo.attenNum}}</text>
					</view>
					<view style="z-index: 999;" class="me-fx-col-c-c">
						<text class="">
							粉丝数
						</text>
						<text>{{userInfo.fansNum}}</text>
					</view>
					<view class="me-fx-col-c-c"  @click="toMyPost">
						<text class="">
							商品数
						</text>
						<text>{{userInfo.goodsNum}}</text>
					</view>
				</view>
			</view>
			<u-cell-group>
				<u-cell size="large">
					<u-icon slot="icon" size="32" name="account-fill"></u-icon>
					<view slot="title" class="account-page_title">
						<navigator url="/pages/resigter/resigter?word=修改个人信息">修改个人信息</navigator>
					</view>
				</u-cell>
				<u-cell size="large">
					<u-icon slot="icon" size="32" name="setting-fill"></u-icon>
					<view slot="title" class="account-page_title">
						<navigator url="/pages/resigter/resigter?word=修改密码">修改密码</navigator>
					</view>
				</u-cell>
				<u-cell size="large">
					<u-icon slot="icon" size="32" name="phone-fill"></u-icon>
					<view slot="title" class="account-page_title">
						<navigator url="/pages/resigter/resigter?word=修改手机号">修改手机号</navigator>
					</view>
				</u-cell>
				<u-cell size="large">
					<u-icon slot="icon" size="32" name="chat-fill"></u-icon>
					<view slot="title" class="account-page_title">
						<navigator url="/pages/feedback/feedback">意见反馈</navigator>
					</view>
				</u-cell>
				<u-cell size="large">
					<u-icon slot="icon" size="32" name="car-fill"></u-icon>
					<view slot="title" class="account-page_title">
						<navigator url="/pages/myPost/myPost">我发布的商品</navigator>
					</view>
				</u-cell>
				<u-cell size="large" title="我的订单">
					<u-icon slot="icon" size="32" name="shopping-cart-fill"></u-icon>
					<view slot="title" class="account-page_title">
						<navigator url="/pages/order/order">我的订单</navigator>
					</view>
				</u-cell>
			</u-cell-group>
			<view class="account-page_button">
				<u-button color="#F25037" style="margin-top: 20px;" @click="logout">退出</u-button>

			</view>
		</view>
	</uni-clayout>
</template>

<script>
	import {
		baseUrl
	} from '@/request/http.js'
	export default {
		data() {
			return {
				userInfo: {}
			};
		},
		onLoad() {

		},
		onShow() {
			this.getUserInfo()
		},
		methods: {
			//跳转到用户发布的商品页
			toUser(userId){
				uni.navigateTo({
					url:`/pages/userInfo/userInfo?id=${userId}`
				})
			},
			//跳转到关注页
			toHeart(){
				uni.navigateTo({
					url:'/pages/heart/heart?current=1'
				})
			},
			toMyPost(){
				uni.navigateTo({
					url:"/pages/myPost/myPost"
				})
			},
			//获取用户信息
			async getUserInfo() {
				let userInfo = await this.$api.getUserIndex()
				userInfo.goodsList = userInfo.goodsList.map(item => {
					const imageList = item.image.split(',').map(items => baseUrl + items)
					return {
						...item,
						imageList
					}
				})
				userInfo.showAvatar = baseUrl + userInfo.avatar
				this.userInfo = userInfo
				// console.log(userInfo,'===')
				uni.setStorageSync('userInfo', userInfo)
			},
			logout() {
				uni.clearStorageSync()
				uni.reLaunch({
					url: '/pages/home/home'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.account-page {
			position: relative;
		// padding: 30rpx;
	}
.account-page_button{
	margin-bottom: 120rpx;
}
	.account-page_head {
		position: relative;
		height: 420rpx;
		padding-top: 50rpx;
		.my-header-background{
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			opacity: .3;
			filter: blur(20rpx);
			image{
				height: 100%;
				width: 100%;
			}
		}
		
	}

	.account-page_avatr {
		padding-bottom: 30rpx;
		// border-bottom: 1px solid #F9F9F9;
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 20rpx;

		image {
			width: 128rpx;
			height: 128rpx;
			border-radius: 50%;
			margin-bottom: 30rpx;
		}
	}

	.account-page_title {
		font-size: 36rpx;
		margin-left: 20rpx;
	}

	/deep/.u-cell__body {
		padding: 40rpx 30rpx !important;
	}
	.me-fx-col-c-c{
		z-index: 999;
	}
	.account-page_detail {
		padding: 0 60rpx;
		color: #a8a8a8;
		font-weight: bold;
	}

	.account-page_button {
		padding: 0 30rpx;
	}
</style>
