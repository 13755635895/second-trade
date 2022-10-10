<template>
	<uni-clayout tabbarIndex="home" :navBarShow="false" pageBackground="#F9F9F9">
		<!--搜索-->
		<view class="home-search me-fx-row-c-c ">
			<u-search v-model="goodsName" :show-action="true" actionText="搜索" :animation="true" @search="inputSearch"
				@focus="isSerch=true" @blur="isSerch=false" @custom="inputSearch">
			</u-search>
		</view>
		<view class="home-body" v-show="isSerch">
			<view class="home_head me-fx-row-sb">
				<text>搜索历史</text>
				<text @click="cleanHistory">清空</text>
			</view>
			<view class="home_list">
				<view class="home_list--item" v-for="item in historyList" :key="item.name" >
					<view class="" @click="doSearch(item.name)">
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
		</view>
		<!--标签-->
		<u-sticky bgColor="#F9F9F9" v-show="!isSerch">
			<u-tabs :list="categoryList" lineColor="#F25037" @click="doCategory">
				<view slot="right" style="padding-left: 4px;" @tap="toTags">
					<u-icon name="setting-fill" size="21" bold></u-icon>
				</view>
			</u-tabs>
		</u-sticky>
		<!--轮播图-->
		<view class="me-fx-1" v-show="!isSerch">
			<scroll-view scroll-y style="height:100%">
				<text style="margin-bottom:10rpx;font-size:24rpx;color: #A8A8A8;padding-left: 30rpx;" >为你推荐</text>
				<view class="home-swiper" v-if="swiperList.length">
					<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500">
						<swiper-item v-for="(item,index) in swiperList" :key="index">
							<image :src="item.image" mode="aspectFill" @click="toDetail(item.goodsId)"></image>
						</swiper-item>
					</swiper>
				</view>
				<!--商品列表-->
				<text style="color: #A8A8A8;font-size: 24rpx;padding-left: 32rpx;margin-top: 10rpx;">商品列表</text>
				<view class="home-list me-fx-row-sb me-fx-wrap">
					<view @click="toDetail(item.goodsId)" class="home-list_item" v-for="item in goodsList"
						:key="item.id">
						<image class="home-list_item--goodsPic" :src="item.image" mode=""></image>
						<view class="home-list_item--goodsName">
							{{item.goodsName}}
						</view>
						<view class="home-list_item--detail me-fx-row-start-c">
							<text>￥</text>
							<text class="home-list_item--price">{{item.goodsPrice}}</text>
							<view class="home-list_item--browse">
								浏览量：{{item.viewnum}}
							</view>
						</view>
						<view class="home-list_item--user me-fx-row-start-c">
							<image :src="item.userAvatar" mode=""></image>
							<text>{{item.goodsUserName}}</text>
						</view>
					</view>
				</view>
				<u-empty mode="list" v-if="!goodsList.length">
				</u-empty>
			</scroll-view>
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
				isSerch: false,
				goodsName: '',
				category: '',
				categoryList: [],
				goodsList: [],
				historyList: [],
				swiperList:[]
			}
		},
		onShow() {
			this.goodsName = ''
			this.category = ''
			this.getHistoryList()
			this.getCategoryList()
			this.getGoodsList()
		},
		onHide() {
			this.isSerch = false
		},
		methods: {
			shuffle(arr) { //首页轮播图图片，随机取图片
			    let i = arr.length; 
			    while (i) { 
			        let j = Math.floor(Math.random() * i--); 
			        [arr[j], arr[i]] = [arr[i], arr[j]]; 
			    } 
				return arr
			},
			//获取商品列表
			async getGoodsList() {
				const params = {
					goodsName: this.goodsName,
					category: this.category
				}
				let goodsList = await this.$api.goodsList(params)
				this.goodsList = goodsList.reverse().map(item => {
					return {
						...item,
						userAvatar: baseUrl + item.userAvatar,
						image: baseUrl + item.goodsImage.split(',')[0]
					}
				})
				const swiperList = this.shuffle([...this.goodsList])
				const list = []
				for (let i = 0; i < 5; i++) {
					if (i < swiperList.length) {
						list.push(swiperList[i])
					}
				}
				this.swiperList = list
			},
			//获取商品标签分类
			async getCategoryList() {
				const token = uni.getStorageSync('token')
				const categoryList = token ? await this.$api.categoryListSelf() : await this.$api.categoryList()
				
				categoryList.unshift('全部')
				this.categoryList = categoryList.map(item => {
					return {
						name: item
					}
				})
			},
			//获取搜索历史
			getHistoryList() {
				const historyList = uni.getStorageSync('historyList')
				this.historyList = historyList ? historyList : []
			},
			//搜索
			inputSearch(e) {
				this.goodsName = e
				this.getGoodsList()
				this.isSerch = false
				if (!e || this.historyList.find(item => item.name == e)) {
					return
				}
				if (this.historyList.length == 10) {
					this.historyList.splice(this.historyList.length - 1, 1)
				}
				this.historyList.unshift({
					name: e
				})
				uni.setStorageSync('historyList', this.historyList)
			},
			doSearch(name) {
				this.goodsName = name
				this.getGoodsList()
				// this.isSerch = false
			},
			doCategory(e) {
				this.category = e.name == '全部' ? '' : e.name
				this.getGoodsList()
			},
			cleanHistory() {
				uni.removeStorageSync('historyList')
				this.historyList = []
			},
			toTags() {
				uni.navigateTo({
					url: '/pages/tagHome/tagHome'
				})
			},
			toDetail(goodsId) {
				uni.navigateTo({
					url: `/pages/goodsDetail/goodsDetail?id=${goodsId}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.home-search {
		height: 100rpx;
		background: #F25037;
		padding: 0 30rpx;
	}

	/deep/.u-search__action {
		color: #FFFFFF;
	}

	.home-list {
		// background: rgb(249, 249, 249);
		padding: 20rpx 32rpx;
	}

	.home-list_item {
		background: #2979FF;
		border-radius: 8px;
		overflow: hidden;
		width: 48%;
		background: #FFFFFF;

		&:nth-child(2n) {
			margin-right: 0rpx;
		}

		&:nth-child(n+3) {
			margin-top: 30rpx;
		}
	}

	.home-list_item--goodsPic {
		height: 320rpx;
		margin-bottom: 16rpx;
	}

	.home-list_item--goodsName {
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		padding: 0 10px;
	}

	.home-list_item--detail {
		color: red;
	padding: 0 10px;

		.home-list_item--price {
			font-size: 36rpx;
			font-weight: bold;
			
		}

		.home-list_item--browse {
			color: #A8A8A8;
			font-size: 24rpx;
			margin-left: 20rpx;
		}
	}

	.home-list_item--user {
			padding: 0 10px 10px;
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

	.home-swiper {
		padding: 30rpx;
		height: 400rpx;

		image {
			height: 100%;
		}
	}

	/deep/.swiper {
		height: 100%;
	}

	.home-body {
		padding: 20rpx;
		background: #FFF;
	}

	.home_head {
		padding: 10rpx 0;
		border-bottom: 1px solid #F9F9F9;
		font-size: 32rpx;

		text:last-child {
			color: green;
		}
	}

	.home_list {
		margin-top: 30rpx;
	}

	.home_list--item {
		position: relative;
		font-size: 32rpx;
		display: inline-block;
		width: 20%;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border: 1px solid #333;
		border-radius: 4px;
		margin-bottom: 50rpx;
		margin-right: 40rpx;
		overflow: hidden;
		z-index: 999;
		white-space: nowrap;
		text-overflow: ellipsis;

		&:nth-child(4n) {
			margin-right: 0rpx;
		}
	}

	.home_list--del {
		position: absolute;
		top: -28rpx;
		right: -28rpx;

	}
</style>
