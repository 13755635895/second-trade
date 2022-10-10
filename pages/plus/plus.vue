<template>
	<uni-clayout navTitle="发布" :tabbarIndex="isEdit?'':'plus'">
		<view class="plus">
			<u--form labelPosition="left" :model="form" ref="form">
				<u-form-item labelWidth="80" label="商品名称" prop="goodsName" borderBottom>
					<u--input v-model="form.goodsName" border="none" placeholder="请输入商品名称"></u--input>
				</u-form-item>
				<u-form-item label="" prop="desc1" borderBottom>
					<u--textarea v-model="form.desc1" placeholder="请描述宝贝的转手原因,使用情况和质量问题" count ></u--textarea>
				</u-form-item>
				<u-form-item labelWidth="80" label="分类" prop="category" borderBottom @click="toAction('category')">
					<u--input v-model="form.category" disabled disabledColor="#ffffff" placeholder="请选择分类"
						border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item labelWidth="80" label="图片" borderBottom labelPosition="top">
					<uni-upload ref="upload"></uni-upload>
				</u-form-item>
				<u-form-item labelWidth="80" label="发布地址" prop="address" borderBottom @click="showAddress = true;">
					<u--input v-model="form.address" disabled disabledColor="#ffffff" border="none"
						placeholder="请选择地址精确到区/楼/寝室号"></u--input>
				</u-form-item>
				<u-form-item labelWidth="80" label="原价" prop="oriPrice" borderBottom>
					<u--input type="number" v-model="form.oriPrice" border="none" placeholder="请输入原价"></u--input>
				</u-form-item>
				<u-form-item labelWidth="80" label="出售价" prop="price" borderBottom>
					<u--input type="number" v-model="form.price" border="none" placeholder="请输入出售价"></u--input>
				</u-form-item>
				<u-form-item labelWidth="80" label="新旧程度" prop="degree" borderBottom @click="toAction('news')">
					<u--input v-model="form.degree" disabled disabledColor="#ffffff" placeholder="请选择新旧程度" border="none">
					</u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item labelWidth="80" label="交易方式" prop="mode" borderBottom>
					<u-radio-group v-model="form.mode" placement="row" @change="groupChange">
						<u-radio label="送货上门" name="送货上门">
						</u-radio>
						<u-radio label="自取" name="自取">
						</u-radio>
					</u-radio-group>
				</u-form-item>
			</u--form>
			<u-action-sheet :show="showAction" :actions="actions" title="请选择" @close="showAction = false"
				:closeOnClickOverlay="true" :closeOnClickAction="true" @select="cateGorySelect">
			</u-action-sheet>
			<u-picker :defaultIndex="defaultIndex" :show="showAddress" ref="uPicker" :columns="columns"
				@change="changeHandler" @cancel="showAddress=false" @confirm="pickerConfirm">
			</u-picker>
			<u-button type="primary" shape="circle" @click="addThings" :text="isEdit?'完成修改':'发布'" color="rgb(242, 80, 55)" style="margin-top: 50rpx;margin-bottom: 100rpx;">
			</u-button>
		</view>
	</uni-clayout>
</template>

<script>
	import {columnData} from '@/config/index.js'
	export default {
		data() {
			const first = columnData.map(item => item.name)
			const second = columnData[0].second.map(item => item.name)
			const third = columnData[0].second[0].third
			return {
				showAction: false,
				showAddress: false,
				columns: [
					first,
					second,
					third
				],
				columnData,
				defaultIndex: [0, 0, 0],
				form: {
					goodsName: '', //商品名称
					category: '', //商品分类
					desc1: '', //商品描述
					image: '', //商品图片
					address: '', //商品地址
					mode: '送货上门', //送货模式
					price: 0, //价格
					oriPrice: 0, //原价
					degree: ''
				},
				categoryGroup: [],
				newsGroup: [{
						name: '全新',
					},
					{
						name: '九五新',
					},
					{
						name: '八五成新',
					},
					{
						name: '八成新',
					},
					{
						name: '七成新',
					},
					{
						name: '六成新',
					},
					{
						name: '五成新',
					},
					{
						name: '伊拉克战损版',
					},
				],
				actions: [],
				field:'news',
				isEdit: false
			};
		},
		async onLoad(query) {
			!uni.getStorageSync('token')&&uni.reLaunch({
				url:'/pages/login/login'
			})
			if (query.isEdit) {
				this.isEdit = true
			   await this.getGoodsDetail(query.id)
			}
			this.getCategoryList()
		},
		
		methods: {
			async getGoodsDetail(id) {
				const userInfo = uni.getStorageSync('userInfo')
				const {
					data
				} = await this.$api.goodsQuery({
					goodsId: id,
					userId:userInfo.userId
				})
				this.form = {...this.form,...data}
				this.$refs.upload.fileList =  data.image.split(',')
				console.log(this.$refs.upload.fileList,'===')
			
			},
			async getCategoryList() {
			    const categoryGroup = await this.$api.categoryList()
				this.categoryGroup = categoryGroup.map(item=>{
					return {
						name:item
					}
				})
			},
			toAction(field) {
				this.showAction = true
				this.field = field
				this.actions = field == 'news' ? this.newsGroup : this.categoryGroup
			},
			cateGorySelect(e) {
				if(this.field=='news') {
					this.form.degree = e.name
				}else {
					this.form.category = e.name
				}
			},
			changeHandler(e) {
				let {
					columnIndex,
					index,
					picker
				} = e
				console.log('e',e)
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
				console.log('column',this.columns)
			},
			groupChange(e) {
				this.form.mode=e
			},
			pickerConfirm(e) {
				console.log(e.value)
				const [area, building, dormitory] = e.value
				this.form.address = `${area}区${building}${dormitory}`
				this.showAddress = false
			},
			async addThings() {
				const {degree,category,goodsName,desc1,address,price,oriPrice,mode
				} = this.form
				if(!goodsName) {
					return this.say('商品名称')
				}
				if(!category) {
					return this.say('分类')
				}
				if(!desc1) {
					return this.say('描述')
				}
				if(!address) {
					return this.say('地址')
				}
				if(!degree) {
					return this.say('新旧')
				}
				if (!this.$refs.upload.fileList.length) {
					return this.say('头像')
				}
				const params = {
					degree,category,goodsName,desc1,address,price,oriPrice,mode,
					image:this.$refs.upload.fileList.join(',')
				}
				if(!this.isEdit){
					await this.$api.goodsAdd(params)
					this.form= {
						goodsName: '', //商品名称
						category: '', //商品分类
						desc1: '', //商品描述
						image: '', //商品图片
						address: '', //商品地址
						mode: '送货上门', //送货模式
						price: 0, //价格
						oriPrice: 0, //原价
						degree: ''
					}
					this.$refs.upload.fileList = []
					uni.showToast({
						title:'发布成功'
					})
					uni.navigateTo({
						url:'/'
					})
				}else {
					await this.$api.goodsEdit({...this.form,image:this.$refs.upload.fileList.join(',')})
					uni.showToast({
						title:'修改成功'
					})
					uni.navigateBack({
						delta:1
					})
				}
				
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
	.plus {
		padding: 20rpx;
	}
	/deep/  .u-radio__icon-wrap .u-radio__icon-wrap--circle{
		background-color: #F56C6C !important;
		border-color: #F56C6C !important;
	}
</style>
