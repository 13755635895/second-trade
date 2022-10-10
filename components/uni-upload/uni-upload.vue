<template>
	<u-upload :fileList="showFileList" @afterRead="afterRead" @delete="deletePic" :maxCount="maxCount" accept="image"
		:previewFullImage="true" :multiple="true"></u-upload>
</template>

<script>
	import {
		baseUrl
	} from "@/request/http.js"
	export default {
		props: {
			maxCount: {
				type: Number,
				default: 6
			}
		},
		data() {
			return {
				fileList: []
			}
		},
		computed: {
			showFileList() {
				const showFileList = [...this.fileList].map(item => {
					return {
						url: baseUrl + item
					}
				})
				
				return showFileList
			}
		},
		methods: {
			//删除图片
			deletePic() {
				this.fileList.splice(event.index, 1)
			},
			async afterRead(e) {
				console.log(e,"===")
				const file = e.file
				const fileList = this.fileList
				for (let i = 0; i < file.length; i++) {
					const {
						fileName
					} = await this.uploadFilePromise(file[i])
					fileList.push(fileName)
				}
				console.log(fileList)
				this.fileList = fileList
				let len = this.fileList.length
				//在反馈组件，把图片数组长度给抛出去
				this.$emit('emitLength',len)
			},
			uploadFilePromise(file) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: `${baseUrl}/common/upload`,
						filePath: file.url,
						name: 'file',
						//传参
						// formData: {
						// },
						success: (res) => {
							console.log(JSON.parse(res.data),'res')
							resolve(JSON.parse(res.data))
						},
						fail(err) {
							console.log(err)
						}
					});
				})
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>
