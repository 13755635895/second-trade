import {
	request
} from "@/request/http.js"
export default {
	login(data) {
		return request({
			url: '/login',
			method: 'POST',
			header:{
				Authorization:0
			},
			data
		})
	},
	getUserIndex(data) {
		return request({
			url: '/system/user/getUserIndex',
			data
		})
	},
	//分类列表
	categoryList() {
		return request({
			url: '/system/label/getDefaultLabel',
			header:{
				Authorization:0
			}
		})
	},
	categoryListSelf() {
		return request({
			url: '/system/label/getUserLabel'
		})
	},
	//分类编辑保存
	categoryEdit(data) {
		return request({
			method:'POST',
			url: '/system/label/editUserLabel?lebels='+data
		})
	},
	//商品列表
	goodsList(data) {
		return request({
			url: '/system/goods/goodsIndex',
			header:{
				Authorization:0
			},
			data
		})
	},
	//下单
	goodsOrder(data) {
return request({
			url: '/system/order/add',
			method:'POST',
			data
		})
	},
	//商品明细出价列表
	goodsDetailPriceList(data) {
		return request({
			url: '/system/price/list',
			data
		})
	},
	//商品明细去出价
	goodsDetailPriceAdd(data) {
		return request({
			url: '/system/price/add',
			method: 'POST',
			data
		})
	},
	//商品明细留言列表
	goodsDetailMsgList(data) {
		return request({
			url: '/system/msg/list',
			data
		})
	},
	//商品明细去留言
	goodsDetailMsgAdd(data) {
		return request({
			url: '/system/msg/add',
			method: 'POST',
			data
		})
	},
	//发布商品
	goodsAdd(data) {
		return request({
			url: '/system/goods/add',
			method: 'POST',
			data
		})
	},
	//编辑商品
	goodsEdit(data) {
		return request({
			url: '/system/goods/edit',
			method: 'POST',
			data
		})
	},
	//我发布商品
	myGoodsList(data) {
		return request({
			url: '/system/goods/add',
			method: 'POST',
			data
		})
	},
	//发布动态
	dynamicAdd(data) {
		return request({
			url: '/system/dynamic/add',
			method: 'POST',
			data
		})
	},
	//删除动态
	dynamicDelete(id){
		return request({
			url:'/system/dynamic/delete/' + id,
			method:'DELETE',
		})
	},
	//展示动态动态
	dynamicList() {
		return request({
			url: '/system/dynamic/list'
		})
	},
	//上传图片
	uploadAvatar(data) {
		return request({
			url: '/system/user/profile/avatar',
			method: 'POST',
			header:{
				Authorization:0
			},
			data
		})
	},
	//获取商品关注列表
	collectList () {
		return request({
			url: '/system/collect/list'
		})
	},
	//获取关注用户
	myfollowuserList() {
		return request({
			url: '/system/myfollowuser/list'
		})
	},
	//添加商品关注
	collectAdd(data) {
		return request({
			url: '/system/collect/add',
			method:'POST',
			data
		})
	},
	//取消
	collectRemove(data) {
		return request({
			url: '/system/collect/remove',
			method:'POST',
			data
		})
	},
	//添加用户关注
	myfollowuserAdd(data) {
		return request({
			url: '/system/myfollowuser/add',
			method:'POST',
			data
		})
	},
	//取消
	myfollowuserRemove(data) {
		return request({
			url: '/system/myfollowuser/remove',
			method:'POST',
			data
		})
	},
	toRegister(data) {
		return request({
			url: '/register',
			method:'POST',
			header:{
				Authorization:0
			},
			data
		})
	},
	//修改密码
	updatePassword(data) {
		return request({
			url: '/system/user/resetPwd',
			method:'POST',
			header:{
				Authorization:0
			},
			data
		})
	},
	//修改手机号
	updatePhoneNum(data) {
		return request({
			url: '/system/user/updatePhoneNum',
			method:'POST',
			data
		})
	},
	//意见反馈
	opinion(data) {
		return request({
			url: '/system/opinion/add',
			method:'POST',
			data
		})
	},
	//修改人信息
	updateUserInfo(data) {
		return request({
			url: '/system/user/updateUserInfo',
			method:'POST',
			data
		})
	},
	//商品详情
	goodsQuery(data) {
		return request({
			url: '/system/goods/query',
			header:{
				Authorization:0
			},
			data
		})
	},
	//订单列表
	myOrder() {
		return request({
			url: '/system/order/list'
			
		})
	},
	//编辑商品
	goodsEdit(data) {
		return request({
			url: '/system/goods/edit',
			method:"POST",
			data
		})
	},
	//我发布的商品
	getUserGoodsList(data) {
		return request({
			url: '/system/goods/list',
			data
			
		})
	},
	//发送手机号
	sendPhoneNum(data) {
		return request({
			url: '/sms/sendSms',
			header:{
				Authorization:0,
			},
			data
		})
	},
	//卖出列表
	mySellOrder(data) {
		return request({
			url: '/system/order/mySellOrder',
			data
		})
	},
	//取消订单
	editOrder(data) {
		return request({
			url: '/system/order/edit',
			method:'post',
			data
		})
	},
	orderQuery(data) {
		return request({
			url: '/system/order/query',
			data
		})
	}
}
