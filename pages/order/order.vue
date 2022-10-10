<template>
	<uni-clayout navTitle="我的订单">
		<view class="order-page">
			<u-subsection :list="list" :current="current" activeColor="#F25037" @change="sectionChange"></u-subsection>
			<view class="me-fx-1 order-likeList">
				<!--我买到的-->
				<scroll-view scroll-y style="height: 100%;"  v-if="current==0">
					<view class="order-likeList_item" v-for="item in goodsList" :key="item.id" @click="goDetail(item.orderId,'buy')">
						<view class="order-likeList_item--user me-fx-row-start-c">
							<view class="me-fx-1 order-status">
								{{item.statusCd}}
							</view>
						</view>
						<view class="me-fx-row">
							<image :src="item.showImage" class="order-like_item--image"></image>
							<view class="order-likeList_goods me-fx-1">
								<view class="order-likeList_item--goodsName">
									{{item.goodsName}}
								</view>
								<view class="order-likeList_item--detail">
									<text>￥</text>
									<text class="order-likeList_item--price">{{item.orderPrice}}</text>
									<!-- <view class="order-likeList_item--browse">
										交易方式：{{item.transactionMode}}
									</view> -->
									<!-- <view class="order-likeList_item--address">
										地址：{{item.address}}
									</view> -->
								</view>
								<view class="me-fx-row-end">
									
								
                             <u-button v-if="item.statusCd=='交易成功'" style="width: 200rpx;" color="#F25037" text="取消订单" @click.native.stop="editOrder(item.orderId)" size="small"></u-button>
							</view>
							</view>
						</view>
					</view>
					<u-empty mode="list" v-if="!goodsList.length">
					</u-empty>
				</scroll-view>
				<!--我卖出的的-->
				<scroll-view scroll-y style="height: 100%;"  v-else>
					<view class="order-likeList_item" v-for="item in sellList" :key="item.id" @click="goDetail(item.orderId,'sell')">
						<view class="order-likeList_item--user me-fx-row-start-c">
							<view class="me-fx-1 order-status">
								{{item.statusCd}}
							</view>
						</view>
						<view class="me-fx-row">
							<image :src="item.showImage" class="order-like_item--image"></image>
							<view class="order-likeList_goods me-fx-1">
								<view class="order-likeList_item--goodsName">
									{{item.goodsName}}
								</view>
								<view class="order-likeList_item--detail">
									<text>￥</text>
									<text class="order-likeList_item--price">{{item.orderPrice}}</text>
									<!-- <view class="order-likeList_item--address" v-if="item.transactionMode=='送货上门'">
										地址：{{item.address}}
									</view> -->
								</view>
				                <view class="order-likeList_item--address">
				                	下单时间：{{item.createTime}}
				                </view>
							</view>
						</view>
					</view>
					<u-empty mode="list" v-if="!sellList.length">
					</u-empty>
				</scroll-view>
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
				list: [{
					name: '我买到的'
				}, {
					name: '我卖出的'
				}],
				current: 0,
				goodsList: [],
				sellList: []
			}
		},
		created(){
			bus.$on('reGetOrderDetail',()=>{
				this.getOrderList()
				this.mySellOrder()
			})
		},
		onLoad() {
			this.getOrderList()
			this.mySellOrder()
		},
		methods: {
			//跳转到商品详情
			goDetail(id,status) {
				uni.navigateTo({
					url:'/pages/order/orderDetail?id='+id+'&status='+status
				})
			},
			//我卖出的
			async mySellOrder() {
				const {
					rows
				} = await this.$api.mySellOrder()
					this.sellList = rows.map(item => {
					return {
						...item,
						showImage: baseUrl + item.goodsImage.split(',')[0]
					}
				})
				this.sellList = this.sellList.sort(function(a,b){
					return new Date(b.createTime) - new Date(a.createTime) 
				})
				console.log('sellList',this.sellList)
			},
			//我买到的
			async getOrderList() {
				const {
					rows
				} = await this.$api.myOrder()
				this.goodsList = rows.map(item => {
					return {
						...item,
						showImage: baseUrl + item.goodsImage.split(',')[0]
					}
				})
				this.goodsList = this.goodsList.reverse()
				console.log('goodList',this.goodsList)
			},
			sectionChange(e) {
				this.current = e
			},
			editOrder(id) {
				uni.showModal({
					content:'确定取消订单？',
					success: async(res) => {
						if(!res.confirm) {
							return
						}
						await this.$api.editOrder({orderId:id})
						uni.showToast({
							title:'取消成功',
							icon:'none'
						})
						this.getOrderList()
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
