<template>
	<uni-clayout navTitle="订单详情">
		<view class="order-page">
			<view class="me-fx-1 order-likeList">
				<view class="order-likeList_item">
					<view class="order-likeList_item--user me-fx-row-start-c">
						<view class="me-fx-1 order-status">
							{{orderDetail.sysGoodsOrder.statusCd}}
						</view>
					</view>
					<view class="me-fx-row">
						<image :src="orderDetail.sysGoodsOrder.showImage" class="order-like_item--image"></image>
						<view class="order-likeList_goods me-fx-1">
							<view class="order-likeList_item--goodsName">
								{{orderDetail.sysGoodsOrder.goodsName}}
							</view>
							<view class="order-likeList_item--detail">
								<text>￥</text>
								<text class="order-likeList_item--price">{{orderDetail.sysGoodsOrder.orderPrice}}</text>
								<view class="order-likeList_item--browse">
									交易方式：{{orderDetail.sysGoodsOrder.transactionMode}}
								</view>
								<view class="order-likeList_item--address">
									下单时间：{{orderDetail.sysGoodsOrder.createTime}}
								</view>

							</view>
							<view class="me-fx-row-end">
								<u-button v-if="orderDetail.sysGoodsOrder.statusCd=='交易成功'" style="width: 200rpx;"
									color="#F25037" text="取消订单" @click="editOrder(orderDetail.sysGoodsOrder.orderId)"
									size="small"></u-button>
							</view>
						</view>
					</view>
				</view>
				<view class="" v-if="orderDetail.sysGoodsOrder.transactionMode=='送货上门'">
					<view class="" v-if="status=='sell'">
						<view class="order-likeList_item--detail">
							买家信息：
							<view class="order-likeList_item--address">
								姓名：{{orderDetail.buyUser.nickName}}
							</view>
							<view class="order-likeList_item--address">
								送货地址：{{orderDetail.sysGoodsOrder.address}}
							</view>
							<view class="order-likeList_item--address">
								电话：{{orderDetail.sysGoodsOrder.phone}}
							</view>
							<view class="order-likeList_item--address">
								取货方式：{{orderDetail.sysGoodsOrder.transactionMode}}
							</view>
						</view>
					</view>
					<view class="" v-else>
						<view class="order-likeList_item--detail">
							卖家信息：
							<view class="order-likeList_item--address">
								姓名：{{orderDetail.sellUser.nickName}}
							</view>
							<view class="order-likeList_item--address">
								联系电话：{{orderDetail.sellUser.phonenumber}}
							</view>
							<view class="order-likeList_item--address">
								交易方式：{{orderDetail.sysGoodsOrder.transactionMode}}
							</view>
						</view>
					</view>
				</view>
				<view class="" v-if="orderDetail.sysGoodsOrder.transactionMode=='自取'">
					<view class="" v-if="status=='sell'">
						<view class="order-likeList_item--detail">
							买家信息：
							<view class="order-likeList_item--address">
								姓名：{{orderDetail.sysGoodsOrder.username}}
							</view>
							<view class="order-likeList_item--address">
								手机号：{{orderDetail.buyUser.phonenumber}}
							</view>
							<view class="order-likeList_item--address">
								交易方式：{{orderDetail.sysGoodsOrder.transactionMode}}
							</view>
						</view>
					</view>
					<view class="" v-else>
						<view class="order-likeList_item--detail">
							卖家信息：
							<view class="order-likeList_item--address">
								卖家姓名：{{orderDetail.sellUser.nickName}}
							</view>
							<view class="order-likeList_item--address">
								卖家电话：{{orderDetail.sellUser.phonenumber}}
							</view>
							<view class="order-likeList_item--address">
								取货地址：{{orderDetail.sysGoodsOrder.address}}
							</view>
							<view class="order-likeList_item--address">
								取货方式：{{orderDetail.sysGoodsOrder.transactionMode}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</uni-clayout>
</template>

<script>
	import bus from '../../utils/eventBus.js'
	import {
		baseUrl
	} from '@/request/http.js'
	export default {
		data() {
			return {
				orderDetail: {
					sysGoodsOrder: {}
				},
				status: '',
				orderId:''
			}
		},
	    onLoad(query) {
			this.orderId = query.id
			this.status = query.status
			this.getInit()
		},
		methods: {
			async getInit() {
				this.orderDetail = await this.$api.orderQuery({
					orderId: this.orderId
				})
				this.orderDetail.sysGoodsOrder.showImage = baseUrl + this.orderDetail.sysGoodsOrder.goodsImage.split(',')[0];
				console.log('orderDetail',this.orderDetail)
			},
			editOrder() {
				uni.showModal({
					content: '确定取消订单？',
					success: async (res) => {
						if (!res.confirm) {
							return
						}
						await this.$api.editOrder({
							orderId: this.orderId
						})
						uni.showToast({
							title: '取消成功',
							icon: 'none'
						})
						bus.$emit('reGetOrderDetail')
						this.getInit()
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.order-page {
		padding: 30rpx;
		height: 100%;
	}

	.order-likeList {
		padding-top: 30rpx
	}

	.order-likeList_item {
		padding-bottom: 20rpx;
		border-bottom: 1px solid #F9F9F9;
	}

	.order-like_item--image {
		width: 180rpx;
		height: 180rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}

	.order-likeList_item--goodsName {
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		padding-left: 16rpx;
	}

	.order-likeList_item--detail {
		color: red;

		.order-likeList_item--price {
			font-size: 36rpx;
			font-weight: bold;
		}

		.order-likeList_item--browse {
			color: #A8A8A8;
			font-size: 24rpx;
			margin-left: 20rpx;
		}
	}

	.order-likeList_item--isLike {
		width: 80rpx;
	}

	.order-likeList_item--user {
		color: #A8A8A8;
		margin-bottom: 20rpx;
		font-size: 24rpx;

		image {
			width: 46rpx;
			height: 46rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
	}

	.order-user_image {
		width: 100rpx;
		height: 100rpx;
	}

	.order-user {
		margin-left: 30rpx;
	}

	.order-user_userName {
		font-weight: bold;
	}

	.order-user_detail {
		color: #A8A8A8;
		margin-top: 20rpx;
		font-size: 24rpx;

		text:first-child {
			margin-right: 10rpx;
		}
	}

	.order-likeList_button {
		margin-top: 20rpx;
	}

	.order-status {
		color: #F25037;
		text-align: right;
	}

	.order-likeList_item--address {
		margin-top: 20rpx;
		color: #A8A8A8;
	}
</style>
