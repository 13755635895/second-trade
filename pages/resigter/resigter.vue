<template>
	<uni-clayout :navTitle="buttonWord">

		<u--form labelPosition="left" :model="resigterForm" ref="resigterForm">
			<block v-if="buttonWord=='注册'||buttonWord=='修改密码'">
				<u-form-item label="账号" prop="username" borderBottom labelWidth="100">
					<u--input v-model="resigterForm.username" border="none" placeholder="请输入账号"></u--input>
				</u-form-item>
				<u-form-item label="密码" prop="password" borderBottom labelWidth="100">
					<u--input v-model="resigterForm.password" border="none" type="password" placeholder="请输入密码">
					</u--input>
				</u-form-item>
			</block>
			<block v-if="buttonWord=='修改密码'">
				<u-form-item label="新密码" prop="newPassWord" borderBottom labelWidth="100">
					<u--input v-model="resigterForm.newPassWord" border="none" type="password" placeholder="请输入新密码">
					</u--input>
				</u-form-item>
			</block>

			<block v-if="buttonWord=='注册'||buttonWord=='修改个人信息'">
				<u-form-item label="昵称" prop="nickName" borderBottom labelWidth="100">
					<u--input v-model="resigterForm.nickName" border="none" placeholder="请输入昵称"></u--input>
				</u-form-item>
				<u-form-item label="性别" prop="sex" borderBottom labelWidth="100">
					<u-radio-group v-model="resigterForm.sex" placement="row">
						<u-radio v-for="(item, index) in radiolist" :key="index" :label="item.label" :name="item.value">
						</u-radio>
					</u-radio-group>
				</u-form-item>

				<u-form-item label="头像" prop="avatr" borderBottom labelWidth="100">
					<uni-upload ref="upload" :maxCount="1"></uni-upload>
				</u-form-item>

			</block>
			<block v-if="buttonWord=='修改手机号'">
				<u-form-item label="新手机号" prop="nphone" borderBottom labelWidth="100">
					<u--input v-model="resigterForm.newPhoneNum" border="none" placeholder="请输入新手机号">
					</u--input>
				</u-form-item>
			</block>
			<block v-if="buttonWord!='修改个人信息'">
				<u-form-item label="手机号码" prop="phone" borderBottom labelWidth="100">
					<u--input v-model="resigterForm.phone" border="none" placeholder="请输入手机号"></u--input>
				</u-form-item>
				<u-form-item label="验证码" prop="code" borderBottom labelWidth="100">
					<u--input v-model="resigterForm.code" border="none" placeholder="请输入验证码"></u--input>
					<u-code seconds="60" ref="uCode" @change="codeChange"></u-code>
					<u-button style="width: 200rpx;" color="#F25037" @tap="getCode">{{tips}}</u-button>
				</u-form-item>
			</block>
		</u--form>
		<view class="resigter">
			<u-button color="#F25037" :text="buttonWord" style="margin-top: 20px;" @click="todo"></u-button>
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
				resigterForm: {
					nickName: '',
					sex: '男',
					username: '',
					password: '',
					avatr: '',
					phone: '',
					code: '',
					newPassWord: '',
					newPhoneNum: ''
				},
				radiolist: [{
						label: '男',
						value: '男'
					},
					{
						label: '女',
						value: '女'
					}
				],
				buttonWord: '注册',
				fileList: [],
				userInfo: null,
				phoneCode: ''
			};
		},
		onLoad(query) {
			this.buttonWord = query.word
		},
		onReady() {
			if (this.buttonWord == '修改个人信息') {
				const userInfo = uni.getStorageSync('userInfo')
				this.resigterForm.sex = userInfo.sex
				this.$refs.upload.fileList = [userInfo.avatar]
				this.resigterForm.nickName = userInfo.nickName
			}
		},
		methods: {
			todo() {
				if (this.buttonWord == '注册') {
					this.toResigter()
				}
				if (this.buttonWord == '修改密码') {
					this.toChangePassword()
				}
				if (this.buttonWord == '修改手机号') {
					this.toChangePhone()
				}
				if (this.buttonWord == '修改个人信息') {
					this.toChangeMsg()
				}

			},
			//修改个人信息
			async toChangeMsg() {
				const {
					nickName,
					sex
				} = this.resigterForm
				if (!nickName) {
					return this.say('昵称')
				}
				if (!this.$refs.upload.fileList.length) {
					return this.say('头像')
				}
				const params = {
					nickName,
					avatar: this.$refs.upload.fileList[0],
					sex
				}
				await this.$api.updateUserInfo(params)
				let userInfo = await this.$api.getUserIndex()
				userInfo.goodsList = userInfo.goodsList.map(item => {
					const imageList = item.image.split(',').map(items => baseUrl + items)
					return {
						...item,
						imageList
					}
				})
				userInfo.showAvatar = baseUrl + userInfo.avatar
				uni.setStorageSync('userInfo', userInfo)
				uni.showToast({
					title: '修改成功',
					duration:1500
				})
				uni.navigateTo({
					url:'/pages/account/account'
				})
			},
			async getCode() {
				if (!isMPStrict(this.resigterForm.phone)) {
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
					const {data} = await this.$api.sendPhoneNum({phone:this.resigterForm.phone})
					this.phoneCode = data
				} 
			},
			
			async toChangePhone() {//修改手机号
				if (!this.resigterForm.newPhoneNum) {
					return this.say('新手机号码')
				}
				if (!this.resigterForm.phone) {
					return this.say('手机号码')
				}
				if (!this.resigterForm.code) {
					return this.say('验证码')
				}
				if(this.resigterForm.code!=this.phoneCode) {
					return uni.showToast({
						title:'验证输入有误！',
						icon:'none'
					})
				}
				const params = {
					newPhoneNum: this.resigterForm.newPhoneNum,
					oldPhoneNum: this.resigterForm.phone,
					code: this.resigterForm.code
				}
				try {
					await this.$api.updatePhoneNum(params)
					uni.showToast({
						title: '修改手机号成功',
					})
					uni.navigateBack({
						delta: 1
					})

				} catch (e) {
					uni.showToast({
						title: '修改手机号失败'
					})
				}
			},
			//修改密码
			async toChangePassword() {
				const {
					username,
					password,
					newPassWord,
					code
				} = this.resigterForm
				if (!username) {
					return this.say('账号')
				}
				if (!password) {
					return this.say('密码')
				}
				if (!newPassWord) {
					return this.say('新密码')
				}
				if (!code) {
					return this.say('验证码')
				}
				if(code!=this.phoneCode) {
					return uni.showToast({
						title:'验证输入有误！',
						icon:'none'
					})
				}
				const params = {
					userName: username,
					password,
					newPassWord,
					code
				}
				try {
					await this.$api.updatePassword(params)
					setTimeout(() => {
						uni.showToast({
							title: '修改密码成功',
						})
					}, 500)
					uni.navigateBack({
						delta: 1
					})
				} catch (e) {
					uni.showToast({
						title: '修改密码失败'
					})
				}
			},
			async toResigter() {
				const {
					username,
					password,
					nickName,
					phone,
					code,
					sex
				} = this.resigterForm
				if (!username) {
					return this.say('账号')
				}
				if (!password) {
					return this.say('密码')
				}
				if (!nickName) {
					return this.say('昵称')
				}
				if (!this.$refs.upload.fileList.length) {
					return this.say('头像')
				}
				if (!phone) {
					return this.say('手机号码')
				}
				if (!code) {
					return this.say('验证码')
				}
				if(code!=this.phoneCode) {
					return uni.showToast({
						title:'验证输入有误！',
						icon:'none'
					})
				}
				const params = {
					username,
					password,
					nickName,
					avatar: this.$refs.upload.fileList[0],
					phone,
					code,
					sex
				}
				try {
					await this.$api.toRegister(params)
					setTimeout(() => {
						uni.showToast({
							title: '注册成功',
						})
					}, 500)
					uni.navigateBack({
						delta: 1
					})
				} catch (e) {
					uni.showToast({
						title: '注册失败'
					})
				}

			},
			say(word) {
				return uni.showToast({
					title: `${word}不能为空`,
					icon: 'none'
				})
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

	.resigter {
		padding: 0 60rpx;
	}
</style>
