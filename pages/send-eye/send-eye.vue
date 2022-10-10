<template>
	<uni-clayout navTitle="发布动态">
		<view class="send-eye">
			<view class="send-eye_head me-fx-row-end">
				<view class="send-eye_btn" @click="addEyes">
					发布
				</view>
			</view>
			<u--textarea v-model="form.content" placeholder="请输入发表内容" style="margin-bottom: 20px;" count></u--textarea>
			<uni-upload ref='upload'></uni-upload>
		</view>


	</uni-clayout>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					content: "",
					image: ''
				}
			};
		},
		methods: {
			//发布动态
			async addEyes() {
				if (!this.form.content) {
					return uni.showToast({
						title: '请输入内容'
					})
				}
				if (this.$refs.upload.fileList.length) {
					this.form.image = this.$refs.upload.fileList.join(',')
				}
				await this.$api.dynamicAdd(this.form)
				setTimeout(() => {
					uni.showToast({
						title: '发表成功'
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
