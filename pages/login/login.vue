<template>
	<uni-clayout navTitle="登录">
		<view class="">
			<image src="../../static/loginbg.jpg" mode=""></image>
		</view>
		<view class="login_head me-fx-row-c-c">
			<view :class="['login_toLogin',current==1?'login_active':'']" @click="changeLogin(1)">
				账号登录
			</view>
			<view :class="['login_toLogin',current==2?'login_active':'']" @click="changeLogin(2)">
				手机登录
			</view>
		</view>
		<view class="login_form">
			<u--form labelPosition="left" :model="form" ref="form">
				<view v-show="current==1">
					<u-form-item label="账号" prop="username" borderBottom labelWidth="100">
						<u--input v-model="form.username" border="none" placeholder="请输入账号"></u--input>
					</u-form-item>
					<u-form-item label="密码" prop="password" borderBottom labelWidth="100">
						<u--input v-model="form.password" border="none" type="password" placeholder="请输入密码">
						</u--input>
					</u-form-item>
				</view>
				<view v-show="current==2">
					<u-form-item label="手机号码" prop="phone" borderBottom labelWidth="100">
						<u--input v-model="form.phone" border="none" placeholder="请输入手机号"></u--input>
						<!-- <u-button type="primary" text="点击获取验证码"></u-button> -->
					</u-form-item>
					<u-form-item label="验证码" prop="code" borderBottom labelWidth="100">


						<u--input v-model="form.code" border="none" placeholder="请输入验证码"></u--input>

						<u-code seconds="60" ref="uCode" @change="codeChange"></u-code>
						<u-button style="width: 200rpx;" color="#F25037" @tap="getCode">{{tips}}</u-button>
					</u-form-item>
				</view>
			</u--form>
		</view>
		<view class="login-button">
			<u-button color="#F25037" text="登录" style="margin-top: 20px;" @click="toLogin"></u-button>
		</view>

		<view class="me-fx-row-sb login-resigter">
			<text @click="toResigter('注册')">注册</text>
			<text @click="toResigter('修改密码')">忘记密码</text>
		</view>
	</uni-clayout>
</template>

<script>
	import {
		isMPStrict
	} from '@/utils/validate.js'
	import {
		baseUrl
	} from '@/request/http.js'
	export default {
		data() {
			return {
				tips: "",
				current: 1,
				form: {
					username: '',
					password: '',
					phone: '',
					code: ''
				},
				phoneCode:''
			};
		},
		methods: {
			changeLogin(val) {
				this.current = val
				this.form = {
					username: '',
					password: '',
					phone: '',
					code: ''
				}
			},
			toResigter(word) {
				uni.navigateTo({
					url: `/pages/resigter/resigter?word=${word}`
				})
			},
			async getCode() {
				if (!isMPStrict(this.form.phone)) {
					return uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					})
				}
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						uni.$u.toast('验证码已发送');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 1000);
					const phoneCode = await this.$api.sendPhoneNum({phone:this.form.phone})
					console.log('phoneCode',phoneCode)
					this.phoneCode = phoneCode.data
				} 
			},
			async toLogin() {
				//账号+密码登录
				if (this.current == 1) {
					const {username,password} = this.form
					if (!username || !password) {
						 uni.showToast({
							title: '用户名或密码不能为空',
							icon: 'none'
						})
						return false
					}
					//账号登录
					let res = await this.$api.login({
						username: this.form.username,
						password: this.form.password
					})
					uni.setStorageSync('token', res.token)
					uni.navigateTo({
						url: '/pages/home/home'
					})
				}
				//手机号登录
				if (this.current == 2) {
					if (!this.form.phone || !this.form.code) {
						 uni.showToast({
							title: '手机号或验证码不能为空',
							icon: 'none'
						})
						return false
					}
					if(this.form.code!=this.phoneCode) {
						return uni.showToast({
							title:'验证码有误！',
							icon:'none'
						})
					}
					let params = {
						loginType: "mobile",
						code: this.form.code,
						username: '2022cwjlxl' + this.form.phone,
						phonenum: this.form.phone
					}
					let res = await this.$api.login(params)
					uni.setStorageSync('token', res.token)
					uni.navigateTo({
						url: '/pages/home/home'
					})
				}
               let userInfo = await this.$api.getUserIndex()
			   userInfo.goodsList = userInfo.goodsList.map(item=>{
				   const imageList = item.image.split(',').map(items=>baseUrl+items)
				   return {
					   ...item,
					   imageList
				   }
			   })
			   userInfo.showAvatar = baseUrl + userInfo.avatar
			   uni.setStorageSync('userInfo', userInfo)
			},
			codeChange(text) {
				this.tips = text;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.login_head {}

	.login_toLogin {
		font-size: 36rpx;
		width: 50%;
		padding: 30rpx;
		text-align: center;
		position: relative;
		font-weight: bold;
		color: #606266;
	}

	.login_active {
		color: #F25037;

		&::after {
			content: '';
			width: 100%;
			height: 10rpx;
			position: absolute;
			left: 0;
			bottom: 0;
			background: #F25037;
		}
	}

	/deep/.u-form-item__body {
		padding: 30px 20px;
	}

	/deep/.u-form-item__body__left__content__label {
		font-size: 36rpx;
	}

	.login-resigter {
		font-size: 24rpx;
		color: #A9A9A9;
		padding: 30rpx;
	}

	.login-button {
		padding: 0 60rpx;
	}
</style>
