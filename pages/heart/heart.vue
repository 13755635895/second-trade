<template>
	<uni-clayout tabbarIndex="heart">
		<view class="heart-page">
			<u-subsection :list="list" :current="current" activeColor="#F25037" @change="sectionChange"></u-subsection>
			<view class="me-fx-1 heart-likeList">
				<scroll-view scroll-y style="height: 100%;" v-if="current==0">
					<view  class="heart-likeList_item me-fx-row" v-for="item in goodsList" :key="item.id"  >
						<image :src="item.showImage" class="heart-like_item--image" @click="toGoods(item.goodsId)"></image>
						<view class="heart-likeList_goods me-fx-1" @click="toGoods(item.goodsId)">
							<view class="heart-likeList_item--goodsName">
								{{item.goodName}}
							</view>
							<view class="heart-likeList_item--detail me-fx-row-start-c">
								<text>￥</text>
								<text class="heart-likeList_item--price">{{item.price}}</text>
								<view class="heart-likeList_item--browse">
									浏览量：{{item.viewNum}}
								</view>
							</view>
							<view class="heart-likeList_item--user me-fx-row-start-c">
								<image :src="item.showSellerAvatar" mode=""></image>
								<text>{{item.sellerNickName}}</text>
							</view>
						</view>
						<view class="heart-likeList_item--isLike me-fx-row-c-c">
							<u-icon name="heart-fill" color="#F25037" size="28" @click="toGoodsLike(item.goodsId)">
							</u-icon>
						</view>
					</view>
					<u-empty mode="list" v-if="!goodsList.length">
					</u-empty>
				</scroll-view>
				<scroll-view scroll-y style="height: 100%;" v-else>
					<view class="heart-likeList_item me-fx-row"
						v-for="item in userList" :key="item.id">
						<image :src="item.showAvatar" mode="" class="heart-user_image" @click="toUser(item.followUserId)"></image>
						<view class="heart-user me-fx-1 me-fx-row">
							<view class="heart-user_item me-fx-1" @click="toUser(item.followUserId)">
								<view class="heart-user_userName">
									{{item.followUserName}}
								</view>
								<view class="heart-user_detail">
									<text>商品数：{{item.goodsNum}}</text>
									<text>粉丝数：{{item.fansNum}}</text>
								</view>
							</view>
							<view class="heart-likeList_item--isLike me-fx-row-c-c">
								<u-icon name="heart-fill" color="#F25037" size="28" @click="toUserLike(item.userId)">
								</u-icon>
							</view>
						</view>
					</view>
					<u-empty mode="list" v-if="!userList.length">
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
				list: [{
					name: '我喜欢的商品'
				}, {
					name: '我关注的用户'
				}],
				current: 0,
				goodsList: [],
				userList: []
			};
		},
		onLoad(query) {
			if(query.current) {
				this.current=query.current
			}
		},
        onShow(){
			this.getCollectList()
			this.getMyfollowuserList()
		},
		methods: {
			toGoods(goodsId) {
				uni.navigateTo({
					url:`/pages/goodsDetail/goodsDetail?id=${goodsId}`
				})
			},
			toUser(userId) {
				uni.navigateTo({
					url:`/pages/userInfo/userInfo?id=${userId}`
				})
			},
			sectionChange(e) {
				this.current = e
			},
			//获取商品关注列表
			async getCollectList() {
				const {
					rows
				} = await this.$api.collectList()
				const goodsList = rows
				this.goodsList = goodsList.map(item => {
					return {
						...item,
						showAvatar: baseUrl + item.avatar,
						showImage: baseUrl + item.image.split(',')[0],
						showSellerAvatar: baseUrl +item.sellerAvatar,
					}
				})
			},
			//获取关注的用户列表
			async getMyfollowuserList() {
				const {
					rows
				} = await this.$api.myfollowuserList()
				const userList = rows
				this.userList = userList.map(item => {
					return {
						...item,
						showAvatar: baseUrl + item.followUserAvatar
					}
				})
			},
			//用户收藏，取关
			async toUserLike(id) {
				await this.$api.myfollowuserRemove({
					followUserId: id
				})
				uni.showToast({
					title: '取消关注成功'
				})
				this.getMyfollowuserList()

			},
			//商品收藏、取关
			async toGoodsLike(goodsId) {
				await this.$api.collectRemove({
					goodsId
				})
				uni.showToast({
					title: '取消收藏成功'
				})
				this.getCollectList()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.heart-page {
		padding: 30rpx;
		height: 100%;
	}

	.heart-likeList {
		padding-top: 30rpx
	}

	.heart-likeList_item {
		padding-bottom: 20rpx;
		border-bottom: 1px solid #F9F9F9;
	}

	.heart-like_item--image {
		width: 180rpx;
		height: 180rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}

	.heart-likeList_item--goodsName {
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		padding-left: 16rpx;
	}

	.heart-likeList_item--detail {
		color: red;

		.heart-likeList_item--price {
			font-size: 36rpx;
			font-weight: bold;
		}

		.heart-likeList_item--browse {
			color: #A8A8A8;
			font-size: 24rpx;
			margin-left: 20rpx;
		}
	}

	.heart-likeList_item--isLike {
		width: 80rpx;
	}

	.heart-likeList_item--user {
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

	.heart-user_image {
		width: 100rpx;
		height: 100rpx;
	}

	.heart-user {
		margin-left: 30rpx;
	}

	.heart-user_userName {
		font-weight: bold;
	}

	.heart-user_detail {
		color: #A8A8A8;
		margin-top: 20rpx;
		font-size: 24rpx;

		text:first-child {
			margin-right: 10rpx;
		}
	}
</style>
