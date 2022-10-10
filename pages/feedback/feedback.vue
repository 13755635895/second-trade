<template>
	<uni-clayout navTitle="意见反馈">
		<view class="send-eye">
			<u--form labelPosition="top" :model="form" ref="form">
				
				<u-form-item label="意见反馈" prop="msg"  labelWidth="100">
	
					<u--textarea maxlength='200' height='300' count v-model="form.msg" placeholder="请输入意见反馈"></u--textarea>
				</u-form-item>
				<text style="color:#303133;font-size: 26rpx;">反馈图片 {{currentLength}}/6</text>
				<u-form-item label="" prop="image"  labelWidth="100">
					<uni-upload @emitLength="emitLength" ref='upload'></uni-upload>
				</u-form-item>
			</u--form>
			<u-button color="#F25037" text="提交反馈" style="margin-top: 20px;" @click="addFeedBack"></u-button>
			
		</view>
	</uni-clayout>
</template>

<script>
	export default {
		data() {
			return {
				currentLength:0,
				form: {
					msg: "",
					image: ''
				}
			};
		},
		methods:{
			emitLength(e){
				console.log(e,'--')
				this.currentLength = e
			},
			//反馈
			async addFeedBack() {
				if (!this.form.msg) {
					return uni.showToast({
						title: '请输入内容',
						icon:'none'
					})
				}
				if (this.$refs.upload.fileList.length) {
					this.form.image = this.$refs.upload.fileList.join(',')
				}
				await this.$api.opinion(this.form)
				setTimeout(() => {
					uni.showToast({
						title: '反馈成功'
					})
				}, 500)
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.send-eye {
		padding: 30rpx;
	}

	.send-eye_btn {
		background: #f25037;
		color: #FFF;
		padding: 10rpx 20rpx;
		border-radius: 4px;
		margin-bottom: 30rpx;
	}

	/deep/.u-textarea__field {
		height: 240rpx !important;
	}
</style>
