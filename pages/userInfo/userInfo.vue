<template>
	<uni-clayout navTitle="用户主页">
		<view class="userInfo-page me-fx-col">
			
			<view class="userInfo-head me-fx-row">
				<image :src="userInfo.showAvatar" mode="" class="userInfo-page_image"></image>
				<view class="userInfo-head_detail me-fx-1">
					<text>{{userInfo.nickName}}</text>
					<view class="userInfo-head_brower">
						<text>粉丝数量：{{userInfo.fansNum}}</text>
						<text>商品数量：{{userInfo.goodsNum}}</text>
					</view>
				</view>
<!-- 				<u-button style="width: 100rpx;" color="#F25037" :text="isLike?'取消关注':'关注'"></u-button>
 -->
			</view>
			<view class="me-fx-1">
				<scroll-view scroll-y="true" style="height: 100%;">
					<view class="userInfo-goodsList  me-fx-row-sb me-fx-wrap">
						<navigator :url="`/pages/goodsDetail/goodsDetail?id=${item.goodsId}`"class="userInfo-goods_item" v-for="item in userInfo.goodsList" :key="item.id">
							<image class="userInfo-goods_item--goodsPic" :src="item.imageList[0]" mode=""></image>
							<view class="userInfo-goods_item--goodsName">
								{{item.goodsName}}
							</view>
							<view class="userInfo-goods_item--detail me-fx-row-start-c">
								<text>￥</text>
								<text class="userInfo-goods_item--price">{{item.price}}</text>
								<view class="userInfo-goods_item--browse">
									浏览量：{{item.viewNum}}
								</view>
							</view>
							<!-- <view class="userInfo-goods_item--user me-fx-row-start-c">
								<image src="../../static/logo.png" mode=""></image>
								<text>{{item.userName}}</text>
							</view> -->
						</navigator>
					</view>
					<u-empty mode="list" v-if="!userInfo.goodsList.length">
					</u-empty>
				</scroll-view>
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
				userInfo: {
					goodsList:[]
				},
				isLike: false,
			
			}
		},
		onLoad(query) {
			this.getUser(query.id)
		},
		methods: {
			async getUser(userId) {
				const params = {
					userId
				}
				const userInfo = await this.$api.getUserIndex(params)
				userInfo.goodsList = userInfo.goodsList.map(item=>{
								   const imageList = item.image.split(',').map(items=>baseUrl+items)
								   return {
									   ...item,
									   imageList
								   }
				})
				userInfo.showAvatar = baseUrl + userInfo.avatar
				this.userInfo = userInfo
				console.log(this.userInfo)
			}
		}
	}
</script>

<style scoped lang="scss">
	.userInfo-page {
		padding: 30rpx;
		height: 100%;
	}
	.userInfo-page_image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}
.userInfo-head{
	margin-bottom: 20rpx;
}
	.userInfo-head_detail {
		font-weight: bold;
		font-size: 36rpx;
	}

	.userInfo-head_brower {
		color: #A8A8A8;
		margin-top: 20rpx;
		font-size: 24rpx;

		text:first-child {
			margin-right: 20rpx;
		}
	}

	.userInfo-goodsList {
		margin-top: 30rpx;
	}

	.userInfo-goods_item {
		background: #2979FF;
		border-radius: 8px;
		overflow: hidden;
		width: 45%;
		background: #FFFFFF;

		&:nth-child(2n) {
			margin-right: 0rpx;
		}

		&:nth-child(n+3) {
			margin-top: 30rpx;
		}
	}

	.userInfo-goods_item--goodsPic {
		height: 320rpx;
		margin-bottom: 16rpx;
	}

	.userInfo-goods_item--goodsName {
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.userInfo-goods_item--detail {
		color: red;

		.userInfo-goods_item--price {
			font-size: 36rpx;
			font-weight: bold;
		}

		.userInfo-goods_item--browse {
			color: #A8A8A8;
			font-size: 24rpx;
			margin-left: 20rpx;
		}
	}

	.userInfo-goods_item--user {
		color: #A8A8A8;
		margin-top: 20rpx;
		font-size: 24rpx;

		image {
			width: 46rpx;
			height: 46rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
	}
</style>
