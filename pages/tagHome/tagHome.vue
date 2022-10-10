<template>
	<uni-clayout navTitle="我的标签" pageBackground="#F9F9F9">
		<view class="tag-home">
			<view class="tag-home_tuijian">
			<view class="tag-home_head me-fx-row-sb">
				<text>我的标签</text>
				<text @click="toEdit">{{isEdit?'保存':'编辑'}}</text>
			</view>
			<view class="tag-home_list">
				<view class="tag-home_list--item" v-for="(item,index) in categoryListSelf" :key="index">
					<text>{{item}}</text>
					<u-icon @click="delTags(item,index)" v-if="isEdit" name="minus-circle-fill" color="red" class="tag-home_list--del" size="24">
					</u-icon>
				</view>
			</view>
</view>
		 <view class="tag-home_tuijian">
				<view class="tag-home_head">
		 		<text>标签推荐</text>
				</view>
				<view class="tag-home_list">
					<view class="tag-home_list--item" v-for="(item,index) in categoryList" :key="item">
						<text>{{item}}</text>
						<u-icon @click="addTags(item,index)" v-if="isEdit" name="plus-circle-fill" color="green" class="tag-home_list--del" size="24">
						</u-icon>
					</view>
				</view>
			</view>
		</view>
	</uni-clayout>
</template>

<script>
	export default {
		data() {
			return {
				categoryListSelf:[],//自己的标签
				categoryList: [],//总的标签列表
				isEdit: false
			};
		},
		onLoad() {
			//一进来就获取所有标签
			this.getCategoryList()
		},
		methods: {
			async getCategoryList() {
				const categoryList = await this.$api.categoryList()
   		        const categoryListSelf = await this.$api.categoryListSelf()
				const list = []
				categoryList.forEach(item=>{
						!categoryListSelf.includes(item)&&list.push(item)
				})
				this.categoryListSelf =  categoryListSelf
				this.categoryList = list 
			},
			delTags(tag,index) {
				this.categoryList.push(tag)
				this.categoryListSelf.splice(index,1)
			},
			addTags(tag,index) {
				this.categoryListSelf.push(tag)
				this.categoryList.splice(index,1)
			},
			async toEdit() {
				this.isEdit = !this.isEdit
				if(!this.isEdit) {
					await this.$api.categoryEdit(this.categoryListSelf.join(','))
					uni.showToast({
						title:'保存成功'
					})
				}
			}
		}

	}
</script>

<style lang="scss" scoped>
	.tag-home {
		// padding: 20rpx;
	}

	.tag-home_head {
		padding: 10rpx 0;
		border-bottom: 1px solid #F9F9F9;
		font-size: 32rpx;

		text:last-child {
			color: green;
		}
	}

	.tag-home_list {
		margin-top: 30rpx;
	}

	.tag-home_list--item {
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

		&:nth-child(4n) {
			margin-right: 0rpx;
		}
	}

	.tag-home_list--del {
		position: absolute;
		top: -28rpx;
		right: -28rpx;

	}
	.tag-home_tuijian {
		margin-bottom: 30rpx;
		background: #FFF;
		padding: 30rpx;
	}
</style>
