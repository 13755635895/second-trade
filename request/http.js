export const baseUrl = 'http://127.0.0.1:8082'

export const request = (params) => {
	let header = {
		...params.header
	}
	header["Authorization"] = header['Authorization'] === 0 ? '' : uni.getStorageSync('token')
	header['Contenst-Type'] = header['Content-Type'] ? header['Content-Type'] : "application/json"
	return new Promise((resolve, reject) => {
		try {
			uni.request({
				method: 'get',
				...params,
				header: header,
				url: baseUrl + params.url,
				success: (res) => {
					const {
						data
					} = res
					if (data.code && data.code == 500) {
						uni.showToast({
							title: data.msg,
							duration: 2000,
							mask: true,
							icon: 'none'
						})
					} else if (data.code && data.code == 401) {
						setTimeout(() => {
							uni.showToast({
								title: '请先登录',
								duration: 2000,
								mask: true,
								icon: 'none'
							})
						}, 500)
						uni.clearStorageSync()
						uni.navigateTo({
							url: '/pages/login/login'
						})
					} else {
						resolve(data)
					}
				},
				fail: (res) => {
					uni.showToast({
						title: '请求异常，请检查网络!',
						duration: 2000,
						mask: true,
						icon: 'none'
					})
				},
				complete: (res) => {

				}
			})
		} catch (e) {
			uni.showToast({
				title: '请求有误！请联系开发管理员'
			})
		}
	})
}
