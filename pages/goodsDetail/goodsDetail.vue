<template>
	<uni-clayout navTitle="商品详情">
		<view class="goodsDetail_page">
			<view class="goodsDetail_user me-fx-row-c-c">
				<image :src="goodsDetail.showAvatar" mode="" class="goodsDetail_user-image" @click="toUser(goodsDetail.userId)"></image>
				<text class="me-fx-1" @click="toUser(goodsDetail.userId)">{{goodsDetail.nickName}}</text>
				<u-button v-if="userInfo.userId!=goodsDetail.userId" style="width: 200rpx;" color="#F25037"
					:text="goodsDetail.isAttenUser=='否'?'关注':'取消关注'" @click="toUserLike">
				</u-button>
			</view>
			<view class="goodsDetail-brower me-fx-row-sb-c">
				<view class="goodsDetail-price">
					<text>￥</text>
					<text>{{goodsDetail.price}}</text>
					<text  style="text-decoration: line-through;">￥{{goodsDetail.oriPrice}}</text>
					<text style="color: #A8A8A8;margin-left: 10rpx;">{{goodsDetail.mode}}</text>
				</view>
				<text>浏览量：{{goodsDetail.viewNum}}</text>
			</view>
			<view class="goodsDetail-desc">
				{{goodsDetail.desc1}}
			</view>
			<view class="goodsDetail-category me-fx-row">
				<view class="goodsDetail-category_one me-fx-col">
					<text>分类</text>
					<text >{{goodsDetail.category}}</text>
				</view>
				<view class="goodsDetail-category_one me-fx-col">
					<text>新旧程度</text>
					<text>{{goodsDetail.degree}}</text>
				</view>
				<view v-if="goodsDetail.createTime" class="goodsDetail-category_one me-fx-col">
					<text>发布时间</text>
					<text>{{goodsDetail.createTime}}</text>
				</view>
			</view>
			<view class="goodsDetail-pic">
				<image :src="img" mode="" v-for="img in goodsDetail.imageList"></image>
			</view>
		</view>
		<view class="goodsDetail-msg">
			<u-tabs :list="list" @click="tabClick"></u-tabs>
			<view class="goodsDetail-input me-fx-row-c-c">
				<u--input :placeholder="current?'感兴趣就出价':'感兴趣就留言'" border="surround" v-model="value"></u--input>
				<text @click="toMsg">{{current?'出价':'留言'}}</text>
			</view>
			<view class="goodsDetail-bottom" v-for="item in bottomlist" :key="item.id">
				<view class="goodsDetail-bottom_item me-fx-row">
					<image :src="item.showAvatar" mode=""></image>
					<view class="goodsDetail-bottom_detail">
						<view class="goodsDetail-bottom_name">{{item.userName}}</view>
						<view v-if="!item.msgInf" style="color: red;">
							{{`￥${item.price}`}}
						</view>
						<view v-else style="color: #909399;margin-bottom: 10rpx;">{{item.msgInf}}</view>
						<view>{{item.createTime}}</view>
					</view>

				</view>
			</view>
		</view>
		<view class="goodsDetail-buy">
			<view class="goodsDetail-buy-detail me-fx-row-end-c">
				<view class="me-fx-col-c-c goodsDetail-buy-like" @click="toGoodsLike"
					v-if="userInfo.userId!=goodsDetail.userId">
					<u-icon :name="goodsDetail.isAttenGoods=='否'?'star':'star-fill'" color="#F25037" size="30"></u-icon>
					<text>{{goodsDetail.isAttenGoods=='否'?'收藏':'取消收藏'}}</text>
				</view>

				<u-button v-if="userInfo.userId==goodsDetail.userId" style="width: 200rpx;" color="#F25037" text="编辑商品"
					@click="goEdit"></u-button>
				<u-button v-else-if="goodsDetail.status=='下架'" style="width: 200rpx;" color="#F25037" text="已售出">
				</u-button>
				<u-button v-else style="width: 200rpx;" color="#F25037" text="下单" @click="goOrder"></u-button>

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
				goodsDetail: {},
				list: [{
					name: '留言',
				}, {
					name: '出价',
				}],
				value: '',
				msgList: [],
				priceList: [],
				bottomlist: [],
				current: 0,
				userInfo: {},
				detailId:''
			};
		},
		onLoad(query) {
			// await this.getGoodsDetail(query.id)
			this.detailId = query.id
			
		},
		async onShow() {
			// if(this.detailId) {
				await this.getGoodsDetail(this.detailId)
				if (uni.getStorageSync('token')) {
					await this.getMsg()
				}
			// }
		},
		methods: {
			//跳转到用户主页
			toUser(userId){
				uni.navigateTo({
					url:`/pages/userInfo/userInfo?id=${userId}`
				})
			},
			async getMsg() {
				const goodsId = this.goodsDetail.goodsId
				const msgList = await this.$api.goodsDetailMsgList({
					goodsId
				})
				this.msgList = msgList.map(item => {
					return {
						...item,
						showAvatar: baseUrl + item.avatar
					}
				})
				const priceList = await this.$api.goodsDetailPriceList({
					goodsId
				})
				this.priceList = priceList.map(item => {
					return {
						...item,
						showAvatar: baseUrl + item.avatar
					}
				})
				this.bottomlist = this.current ? this.priceList : this.msgList

			},
			async toMsg() {
				const goodsId = this.goodsDetail.goodsId
				if (this.current) {
					await this.$api.goodsDetailPriceAdd({
						goodsId,
						price: this.value
					})
					uni.showToast({
						title: '出价成功'
					})
				} else {
					await this.$api.goodsDetailMsgAdd({
						goodsId,
						msgInf: this.value
					})
					uni.showToast({
						title: '留言成功'
					})
				}
				this.value = ''
				this.getMsg()
			},
			async getGoodsDetail(id) {
				const userInfo = uni.getStorageSync('userInfo')
				const {
					data
				} = await this.$api.goodsQuery({
					goodsId: id,
					userId: userInfo ? userInfo.userId : ""
				})
				this.goodsDetail = data
				this.goodsDetail.imageList = data.image.split(',').map(item => baseUrl + item)
				this.goodsDetail.showAvatar = baseUrl + this.goodsDetail.userAvatar
				console.log(this.goodsDetail)
				this.userInfo = userInfo

			},
			//切换留言和出价
			tabClick(e) {
				this.current = e.index
				this.bottomlist = this.current ? this.priceList : this.msgList
			},
			async toUserLike() {
				const followUserId = this.goodsDetail.userId
				if (this.goodsDetail.isAttenUser == '否') {
					await this.$api.myfollowuserAdd({
						followUserId
					})
					this.goodsDetail.isAttenUser = '是'
					uni.showToast({
						title: '关注成功'
					})
				} else {
					await this.$api.myfollowuserRemove({
						followUserId
					})
					this.goodsDetail.isAttenUser = '否'
					uni.showToast({
						title: '取消关注成功'
					})
				}

			},
			async toGoodsLike() {
				const goodsId = this.goodsDetail.goodsId
				if (this.goodsDetail.isAttenGoods == '否') {
					await this.$api.collectAdd({
						goodsId
					})
					this.goodsDetail.isAttenGoods = '是'
					uni.showToast({
						title: '收藏成功'
					})
				} else {
					await this.$api.collectRemove({
						goodsId
					})
					this.goodsDetail.isAttenGoods = '否'
					uni.showToast({
						title: '取消收藏成功'
					})
				}

			},
			goOrder() {
				const token = uni.getStorageSync('token')
				const url = token ? `/pages/cart/cart?id=${this.goodsDetail.goodsId}` : `/pages/login/login`
				uni.navigateTo({
					url
				})
			},
			goEdit() {
				uni.navigateTo({
					url: `/pages/plus/plus?isEdit=true&id=${this.goodsDetail.goodsId}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goodsDetail_page {
		padding: 30rpx;
	}

	.goodsDetail_user {
		font-weight: bold;
		font-size: 36rpx;
	}

	.goodsDetail_user-image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.goodsDetail-brower {
		color: #A8A8A8;
		margin-top: 20rpx;
		font-size: 24rpx;
	}

	.goodsDetail-price {
		height: 60rpx;
		line-height: 60rpx;
		color: red;
		text:nth-child(2) {
			font-size: 36rpx;
			font-weight: bold;
		}

		text:nth-child(3) {
			color: #A8A8A8;
			margin-left: 20rpx;
		}
	}

	.goodsDetail-desc {
		margin-top: 40rpx;
		font-size: 36rpx;
		line-height: 60rpx;
		letter-spacing: 2rpx;
		text-indent: 40rpx;
	}

	.goodsDetail-category {
		margin-top: 60rpx;
		display: flex;
		justify-content: center;
	}

	.goodsDetail-category_one {
		margin-right: 60rpx;
		color: #a8a8a8;
		position: relative;
		text:last-child {
			font-size: 26rpx;
			color: #333;
			font-weight: bold;
		}

		&::after {
			content: "";
			position: absolute;
			top: 0;
			right: -30rpx;
			width: 2rpx;
			background: #a8a8a8;
			display: block;
			height: 80rpx;
		}
	}

	.goodsDetail-pic {
		margin-top: 50rpx;

		image {
			height: 600rpx;
			border-radius: 10rpx;
		}
	}

	.goodsDetail-msg {
		border-top: 6px solid #f9f1f2;
	}

	/deep/.u-tabs__wrapper__nav__line {
		background: #F25037 !important;
	}

	.goodsDetail-input {
		padding: 30rpx;
		border-radius: 16px;

		text {
			color: #F25037;
			margin-left: 10rpx;
		}
	}

	.goodsDetail-bottom {
		padding: 0 30rpx 30rpx;
	}

	.goodsDetail-bottom_item {
		margin-bottom: 30rpx;

		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}

		.goodsDetail-bottom_name {
			font-weight: bold;
			font-size: 30rpx;
			color: #A8A8A8;
			margin-bottom: 10rpx;
		}
	}

	.goodsDetail-buy {
		padding: 60rpx;
	}

	.goodsDetail-buy-detail {
		position: fixed;
		left: 0;
		bottom: 0;
		height: 120rpx;
		width: 100%;
		border-top: 1px solid #F9F9F9;
		background: #FFF;
		padding: 40rpx;
	}

	.goodsDetail-buy_button {
		height: 80rpx;
		background-color: #F25037;
		color: #FFF;
		width: 200rpx;
		font-size: 40rpx;
		border-radius: 16px;
	}

	.goodsDetail-buy-like {
		color: #F25037;
		margin-right: 20rpx;
	}
</style>
