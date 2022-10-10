<template>
	<uni-clayout navTitle="我发布的商品">
		<view class="post-page">
			<u-subsection :list="list" :current="current" activeColor="#F25037" @change="sectionChange"></u-subsection>
			<view class="me-fx-1 post-likeList">
				<scroll-view scroll-y style="height: 100%;">

					<view class="post-likeList_item" v-for="item in goodsList" :key="item.id">
						<view class="me-fx-row">
							<image :src="item.showImage" class="post-like_item--image"></image>
							<view class="post-likeList_goods me-fx-1">
								<view class="post-likeList_item--goodsName">
									{{item.goodsName}}
								</view>
								<view class="post-likeList_item--detail me-fx-row-start-c">
									<text>￥</text>
									<text class="post-likeList_item--price">{{item.price}}</text>
									<view class="post-likeList_item--browse">
										浏览量：{{item.viewNum}}
									</view>
								</view>
								<!-- <view class="post-likeList_item--user me-fx-row-start-c">
									<image src="../../static/logo.png" mode=""></image>
									<text>{{item.userName}}</text>
								</view> -->
							</view>
						</view>
						<view class="me-fx-row-end post-likeList_button">
							<block v-if="!current">
							<u-button style="width: 100rpx;" text="下架" @click="toEdit(item.goodsId)"></u-button>
							</block>
							<block v-else>
								<u-button style="width: 100rpx;" text="上架" @click="toEdit(item.goodsId)"></u-button>
							</block>
							<navigator :url="`/pages/plus/plus?isEdit=true&id=${item.goodsId}`">
								<u-button style="width: 100rpx;" text="编辑"></u-button>
							</navigator>
							
						
						</view>
					</view>
                 <u-empty mode="list" v-if="!goodsList.length">
                 </u-empty>
				</scroll-view>
			</view>

		</view>

	</uni-clayout>
</template>

<script>
	import {baseUrl} from '@/request/http.js'
	export default {
		data() {
			return {
				list: [{
					name: '在卖'
				}, {
					name: '已下架'
				}],
				current: 0,
				status:'下架',
				goodsList: [],
			};
		},
		onLoad() {
	
		},
		onShow() {
				this.getUserGoodsList()
		},
		methods: {
			async getUserGoodsList() {
				const status = this.current?'下架':'在售'
				const {rows} = await this.$api.getUserGoodsList({status})
				this.goodsList = rows.map(item=>{
					return {
						...item,
						showImage:baseUrl+item.image.split(',')[0]
					}
				})
			},
			async toEdit(goodsId) {
				const params = {
					goodsId,
					status:this.status
				}
				await this.$api.goodsEdit(params)
				uni.showToast({
					title:'操作成功'
				})
				this.getUserGoodsList()
			},
			sectionChange(e) {
				this.current = e
				this.status = e?'在售':'下架'
				this.getUserGoodsList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.post-page {
		padding: 30rpx;
	}

	.post-likeList {
		padding-top: 30rpx
	}

	.post-likeList_item {
		padding-bottom: 20rpx;
		border-bottom: 1px solid #F9F9F9;
	}

	.post-like_item--image {
		width: 180rpx;
		height: 180rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}

	.post-likeList_item--goodsName {
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		padding-left: 16rpx;
	}

	.post-likeList_item--detail {
		color: red;

		.post-likeList_item--price {
			font-size: 36rpx;
			font-weight: bold;
		}

		.post-likeList_item--browse {
			color: #A8A8A8;
			font-size: 24rpx;
			margin-left: 20rpx;
		}
	}

	.post-likeList_item--isLike {
		width: 80rpx;
	}

	.post-likeList_item--user {
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

	.post-user_image {
		width: 100rpx;
		height: 100rpx;
	}

	.post-user {
		margin-left: 30rpx;
	}

	.post-user_userName {
		font-weight: bold;
	}

	.post-user_detail {
		color: #A8A8A8;
		margin-top: 20rpx;
		font-size: 24rpx;

		text:first-child {
			margin-right: 10rpx;
		}
	}

	.post-likeList_button {
		margin-top: 20rpx;
	}
</style>
