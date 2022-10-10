<template>
	<uni-clayout navTitle="购买宝贝" pageBackground="#F9F9F9">
		<view class="cart-page">
			<view class="cart-goods me-fx-row">
				<image :src="goodsDetail.imageList[0]" mode=""></image>
				<view class="cart-right me-fx-1 me-fx-col-c">
					<view class="">
						{{goodsDetail.goodsName}}
					</view>
					<view class="desc">
						{{goodsDetail.desc1}}
					</view>
					<view class="cart-price me-fx-1 me-fx-row-end">
						<text>￥</text>
						<text>{{goodsDetail.price}}</text>
					</view>
				</view>
			</view>
			<view class="cart-address">
				<u--form labelPosition="left" :model="form" ref="form">
					<u-form-item labelWidth="80" label="收货人姓名" prop="userName">
						<u--input v-model="form.username" border="none" placeholder="请输入姓名"></u--input>
					</u-form-item>
					<u-form-item labelWidth="80" label="收货人电话" prop="phone">
						<u--input v-model="form.phone" border="none" placeholder="请输入电话"></u--input>
					</u-form-item>


					<u-form-item labelWidth="80" label="收货地址" prop="address" @click="showAddress = true;" v-if="goodsDetail.mode=='送货上门'">
						<u--input v-model="form.address" disabled disabledColor="#ffffff" border="none"
							placeholder="请选择地址精确到区/楼/寝室号"></u--input>
					</u-form-item>
					<!-- <u-form-item labelWidth="80" label="交易方式" prop="mode">
						<u-radio-group v-model="form.transactionMode" placement="row">
							<u-radio activeColor="rgb(242, 80, 55)" label="送货上门" name="送货上门">
							</u-radio>
							<u-radio activeColor="rgb(242, 80, 55)" label="自取" name="自取">
							</u-radio>
						</u-radio-group>
					</u-form-item> -->
				</u--form>
				<u-picker :defaultIndex="defaultIndex" :show="showAddress" ref="uPicker" :columns="columns"
					@change="changeHandler" @cancel="showAddress=false" @confirm="pickerConfirm">
				</u-picker>
			</view>
		</view>
		<view class="cart-bottom me-fx-row-sb-c">
			<view class="cart-bottom_price">
				<text>实付款</text>
				<text>
					<text>￥</text>
					<text>5.00</text>
				</text>
			</view>
			<u-button style="width: 200rpx;" color="#F25037" text="确定购买" @click="order"></u-button>

		</view>
	</uni-clayout>
</template>

<script>
	import {
		columnData
	} from '@/config/index.js'
	import {
		baseUrl
	} from '@/request/http.js'
	export default {
		data() {
			const first = columnData.map(item => item.name)
			const second = columnData[0].second.map(item => item.name)
			const third = columnData[0].second[0].third
			return {
				showAddress: false,
				columns: [
					first,
					second,
					third
				],
				columnData,
				defaultIndex: [0, 0, 0],
				form: {
					username: '',
					phone: '',
					address: '', //商品地址
					transactionMode: '送货上门', //送货模式
				},
				goodsDetail: {
					imageList:[]
				}
			};
		},
		onLoad(query) {
			this.getGoodsDetail(query.id)
		},
		methods: {
			async getGoodsDetail(id) {
				const {
					data
				} = await this.$api.goodsQuery({
					goodsId: id
				})
				this.goodsDetail = data
				this.goodsDetail.imageList = data.image.split(',').map(item => baseUrl + item)
			},
			changeHandler(e) {
				let {
					columnIndex,
					index,
					picker
				} = e
				picker = picker || this.$refs.uPicker // 微信小程序无法将picker实例传出来，只能通过ref操作
				if (columnIndex === 2) {
					this.defaultIndex[2] = index
				}
				if (columnIndex === 0) {
					console.log(this.columnData)
					const second = this.columnData[index].second.map(item => item.name)
					this.$set(this.columns, 1, second)
					const third = this.columnData[index].second[0].third
					this.$set(this.columns, 2, third)
					this.defaultIndex = [index, 0, 0]
				}
				if (columnIndex === 1) {
					const firstIndex = this.defaultIndex[0]
					const third = this.columnData[firstIndex].second[index].third
					this.$set(this.columns, 2, third)
					this.defaultIndex = [firstIndex, index, 0]
				}


			},
			pickerConfirm(e) {
				const [area, building, dormitory] = e.value
				this.form.address = `${area}区${building}${dormitory}`
				this.showAddress = false
			},
			async order() {
				const {

					username,
					phone,
					address,
					transactionMode
				} = this.form
				if (!username) {
					return this.say('收货人')
				}
				if (!phone) {
					return this.say('电话')
				}
			
				if (this.goodsDetail.mode=='送货上门'&&!address) {
					return this.say('收货地址')
				}
				const params = {
					username,
					phone,
					address,
					transactionMode:this.goodsDetail.mode,
					goodsId:this.goodsDetail.goodsId
				}
				await this.$api.goodsOrder(params)
				uni.showToast({
					title: '下单成功'
				})
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/order/order'
					})
				},500)
			},
			say(word) {
				return uni.showToast({
					title: `${word}不能为空`,
					icon: 'none'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/  .input-placeholder{
		font-size: 24rpx;
		padding-left: 20rpx;
	}
	/deep/  .u-radio__icon-wrap .u-radio__icon-wrap--circle{
		background-color: #F56C6C !important;
		border-color: #F56C6C !important;
	}
	/deep/ .u-form-item__body__right__content__slot{
		margin-left: 20rpx;
	}
	.cart-page {
		padding: 30rpx;
	}
	.desc{
	font-size: 24rpx;
	color: #909399;
	margin-top: 30rpx;
}
	.cart-goods {
		background: #FFF;
		padding: 30rpx;

		image {
			width: 160rpx;
			height: 160rpx;
			border-radius: 8px;
			margin-right: 20rpx;
		}
	}

	.cart-price {
		color: red;
		align-items: flex-end;

		text:last-child {
			font-size: 36rpx;
		}
	}

	.cart-address {
		background: #FFF;
		padding: 30rpx;
		margin-top: 30rpx;
	}

	.cart-bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 120rpx;
		background: #FFF;
		padding: 30rpx;
	}

	.cart-bottom_price {
		color: red;
		font-size: 32rpx;
		font-weight: bold;
	}
</style>
