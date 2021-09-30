<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			//#ifdef APP-PLUS
			this.getVersion() //检测版本
			//#endif

			// 获取设备唯一标识
			//#ifdef H5      
			var codeid = null
			if (!uni.getStorageSync('clientId')) {
				codeid = this.generateUUID() //生成设备唯一标识
				uni.setStorageSync('clientId', codeid)
			}
			console.log('pc端');
			console.log('H5,当前设备ID', uni.getStorageSync('clientId'))
			//#endif

			//#ifdef APP-PLUS

			console.log('设备是否存在唯一标识', uni.getStorageSync('clientId'));
			if (!uni.getStorageSync('clientId')) {
				console.log(plus.device.uuid);
				var clientid = plus.device.uuid || Math.round(Math.random() * 10) + (new Date()).valueOf();
				console.log('移动端,当前设备ID', clientid) //生成设备唯一标识
				uni.setStorageSync('clientId', clientid)
			} else {
				console.log('移动端');
				console.log('APP,当前设备ID', uni.getStorageSync('clientId')) //生成设备唯一标识
			}


			//设置引导页
			const value = uni.getStorageSync('firstOpen')
			if (value === true) {
				console.log(value)
				uni.switchTab({
					url: '/pages/index/index'
				})
			} else {
				console.log(value)
				uni.reLaunch({
					url: '/pages/guidePage/guidePage'
				})
			}

			//用户开屏引导页面
			const newuser = uni.getStorageSync('isNewuser')
			// #endif

		},
		onShow: function() {
			console.log('App Show')

		},
		onHide: function() {
			console.log('App Hide')
			// uni.removeStorageSync('positionStorage') //当应用隐藏时清除定位缓存，可重新获取定位
		},
		methods: {
			getVersion() {
				uni.showLoading({
					title: '正在检测新版本...'
				})
				let onLineVersion = null
				let nowVersion = null
				this.$zshs.request('/web/users/recovery-classify', {
						mode: 'getAppInfo',
						user: 'common'
					}, 'POST')
					.then(res => {
						console.log(res);
						if (res.code == 200) {
							onLineVersion = res.data.version_name
							this.$queue.setData('Version', onLineVersion)
							let d_url = res.data.down_url
							// let versionNews = `1、新增个人信息模块,2、新增版本信息模块`
							plus.runtime.getProperty(plus.runtime.appid, function(inf) {
								nowVersion = inf.version
								console.log(nowVersion)
								//此处请求后端获取线上版本
								uni.hideLoading();
								// 如果线上版本大于本地版本
								if (onLineVersion !== nowVersion) {
									uni.showModal({
										title: '系统更新提示',
										content: '发现新版本是否升级？',
										cancelColor: '#646464',
										confirmColor: '#F7A300',
										success(ress) {
											if (ress.confirm) {
												plus.runtime.openURL(d_url);
											}
										}
									})
								}
							})
						} else {
							uni.hideLoading()
							uni.showToast({
								icon: 'none',
								title: '检测更新系统失败，请稍后再试'
							})
						}
					})
					.catch(err => {
						console.log(err);
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: '检测更新系统失败，请稍后再试'
						})
					})
			},
			// getUserPosition() {
			// 	let _this = this
			// 	uni.getLocation({ //APP定位
			// 		type: 'gcj02',
			// 		geocode: true, //设置该参数为true可直接获取经纬度及城市信息，h5不支持解析地址信息
			// 		success: function(res) {
			// 			console.log(res, '获取定位成功')
			// 			let temp = {
			// 				city: res.address.city,
			// 				area: res.address.district,
			// 				latitude: res.latitude,
			// 				longitude: res.longitude
			// 			}
			// 			uni.setStorageSync('positionStorage', temp)
			// 			// let historyList =  _this.$queue.getData('p_history')|| []
			// 			// historyList.map((item,i)=>{
			// 			// 	if(item.area == temp.area){
			// 			// 		console.log(i);
			// 			// 		historyList.splice(i,1)
			// 			// 	}
			// 			// })
			// 			// historyList.unshift(temp)
			// 			// _this.$queue.setData('p_history',historyList)
			// 		},
			// 		fail: function(e) {
			// 			console.log(e);
			// 			uni.showToast({
			// 				icon: 'none',
			// 				title: '获取定位失败，请授权'
			// 			})
			// 		}
			// 	});
			// },
			//app生成随机UUID 新添加
			S4() {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			},
			guid() {
				return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() +
					this.S4() +
					this.S4());
			},
			//app生成随机UUID 新添加

			//pc端生成UUID
			generateUUID() { //生成uuid设备唯一标识码
				var d = new Date().getTime();
				if (window.performance && typeof window.performance.now === "function") {
					d += performance.now(); //use high-precision timer if available
				}
				var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = (d + Math.random() * 16) % 16 | 0;
					d = Math.floor(d / 16);
					return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
				});
				return uuid;
			}
			//pc端生成UUID
		}
	}
</script>
<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	/*编译是为了防止uview的全局css和nvue页面冲突*/

	/* #ifdef APP-VUE || H5 || MP-WEIXIN*/
	@import "uview-ui/index.scss";
	/* #endif*/
</style>
<style>
	/*每个页面公共css */
</style>
