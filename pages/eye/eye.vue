<template>
	<uni-clayout tabbarIndex="eye">
		<u-toast ref="uToast"></u-toast>
		<view class="eye-page">
			<view class="eye-page_send me-fx-row-end-c">
				<navigator url="/pages/send-eye/send-eye">发布动态</navigator>
			</view>
			<view class="me-fx-1">
				<scroll-view scroll-y style="height:100%">
					<view class="eye-list">
						<view class="eye-list_item me-fx-row" v-for="item in eyeList" :key="item.id">
							<image :src="item.avatar" mode="" class="eye-list_avatr"></image>
							<view class="eye-list_detail me-fx-1">
								<view class="eye-list_userName">
									{{item.userName}}
								</view>
								<view class="eye-list_wrod">
									{{item.content}}
								</view>
								<view class="eye-list_image me-fx-row me-fx-wrap" v-if="item.imageList.length">
									<image :class="item.imageList.length>1?'eye-list_image--more':'eye-list_image--one'"
										:src="items" mode="" v-for="items in item.imageList"></image>
								</view>
								<view class="eye-list_time">
									{{item.createTime}}
								</view>
								<u-button @click="deleteDynamic(item.dynamicId)" v-if="userId == item.userId"
									style="width: 50rpx;background-color:#F25037;color: #fff;" size="mini">删除</u-button>
							</view>

						</view>
					</view>
					<u-empty mode="list" v-if="!eyeList.length">
					</u-empty>
				</scroll-view>
			</view>
		</view>
	</uni-clayout>
</template>

<script>
	import {
		baseUrl
	} from "@/request/http.js"
	export default {
		data() {
			return {
				userId: JSON.parse(localStorage.getItem('userInfo')).data.userId,
				eyeList: [],
				paramsObj: {
					type: 'success',
					message: "删除成功！",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
				}
			};
		},
		onShow() {
			console.log('userId', this.userId)
			this.getDynamicList()
		},
		methods: {
			//获取动态列表
			async getDynamicList() {
				const dynamicList = await this.$api.dynamicList()
				this.eyeList = dynamicList.rows.map(item => {
					let imageList = []
					if (item.image) {
						imageList = item.image.split(',').map(items => baseUrl + items)
					}
					return {
						...item,
						imageList,
						avatar: baseUrl + item.avatar
					}
				})
			},
			//删除动态
			async deleteDynamic(id) {
				await this.$api.dynamicDelete(id)
				this.$refs.uToast.show({
					...this.paramsObj,
				})
				this.getDynamicList();
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.eye-page_send {
		height: 80rpx;
		padding-right: 20rpx;
		color: #F25037;
		// border-bottom: 1px solid;
	}

	.eye-list {
		padding: 0 30rpx 100rpx;
	}

	.eye-list_item {
		padding: 30rpx 0;
		border-bottom: 1px solid #F9F9F9;
	}

	.eye-list_avatr {
		width: 64rpx;
		height: 64rpx;
		border-radius: 8px;
		margin-right: 20rpx;
	}

	.eye-list_userName {
		font-size: 32rpx;
		margin-bottom: 20rpx;
		font-weight: bold;
		color: #F25037;
	}

	.eye-list_wrod {
		font-size: 32rpx;
		margin-bottom: 20rpx;
	}

	.eye-list_image--more {
		width: 30%;
		height: 160rpx;
		margin-left: 20rpx;
		object-fit: cover;

		&:first-child {
			margin-left: 0;
		}

		&:nth-child(4n) {
			margin-left: 0;
		}

		&:nth-child(n+4) {
			margin-top: 20rpx;
		}
	}

	.eye-list_image--one {
		width: 400rpx;
		// object-fit: cover;
		height: 500rpx;
	}

	.eye-list_time {
		margin-top: 20rpx;
		color: #A8A8A8;
		font-size: 24rpx;
	}
</style>
