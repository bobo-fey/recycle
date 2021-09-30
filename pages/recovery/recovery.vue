<template>
	<view class="content">
		<map  id="map" class="map" ref="map" :latitude="latitude" show-location :longitude="longitude" :markers="markers" @markertap="markertap" :polyline="poltline" :scale="scale"></map>
		<!-- 定位与回收 -->
		<view class="top_header">
			<view class="adress_position" @click="showPicker()">
				<image class="position_icon" src="../../static/dinwei.png" mode="aspectFill"></image>
				<view class="adress_text">{{district}}</view>
			</view>
			<view class="btn-view">
				<view class="recover-btn" @click="navTo('/pages/createdOrder/chooseType')">
					预约回收
				</view>
				<view class="cart_img" @click="toCart('/pages/cart/cart')">
					<image class="cart_icon" src="../../static/huishouche.png" mode="aspectFill"></image>
					<view class="red_number" v-if="cartNumber > 0">{{cartNumber}}</view>
				</view>
			</view>
		</view>
		<!-- 定位详情 -->
		<view class="position_detail">
			<view class="loading-view" v-if="loading">
				<view class="loading"> </view>
				加载中...
			</view>
			<view class="company_view" v-if="!loading && hasData">
				<view class="company_name">
					{{siteData.shop_name}}
				</view>
				<view class="address">
					{{siteData.address}}
				</view>
				<view class="distance">
					<view class="distance_tips">距离</view>
					<view class="distance_number">
						{{siteData.distance > 1 ? `${siteData.distance.toFixed(1)}KM`: `${siteData.distance.toFixed(3)*1000}M`}}
					</view>
				</view>
				<view class="category">
					<view class="category_item" v-for="(item,index) in siteData.order_take" :key="index">
						{{item}}
					</view>
				</view>
			</view>
			<view class="nodata-tips" v-if="!loading &&!hasData">
				附近没有回收点，您可以预约上门回收
			</view>
			<view class="position-btn" id="pantBtn" @click="getMyLocation">
				<cover-image class="position-img" src="../../static/map/recovery.png" mode="aspectFill"></cover-image>
			</view>
			<!-- <view class="subscribe_btn">
				预约回收
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				markers:[],
				cartNumber: 0,
				district: '正在获取定位',
				loading: false,
				hasData: false,
				latitude: 22.229158, //纬度
				longitude: 111.399284, //经度
				mylatitude:'', //我的维度
				mylongitude:'', // 我的经度
				mylocation:[],//我的位置图标
				siteArray:[],//站点图标
				area_marker:{}, //区域图标
				orange_location: '../../static/map/orange_location.png', //点击的图标
				bule_location: '../../static/map/bule_location.png', //站点默认图标
				red_location:'../../static/map/red_location.png',//手动标记点图标
				// scale: 5, //最小数，缩放范围最大，可见程度最大
				scale: 14, //最大数，缩放范围最小，可见程度最小
				tapsite:null,
				// isShowLocation:true,
				poltline:[],
				// pl:[{
				// 	longitude:110.39947,
				// 	latitude:21.228893,
				// },
				// {
				// 	longitude:110.399265,
				// 	latitude:21.229084,
				// },
				// {
				// 	longitude:110.38327,
				// 	latitude:21.191519,
				// },
				// {
				// 	longitude:110.406303,
				// 	latitude:21.200354,
				// },
				// {
				// 	longitude:110.376129,
				// 	latitude:21.19933,
				// },
				// {
				// 	longitude:110.38854,
				// 	latitude:21.195876,
				// },
				// {
				// 	longitude:110.399284,
				// 	latitude:22.195158,
				// },
				// ]
			}
		},
		onShow() {
			if (uni.getStorageSync('isLogin')) { //回收车数目
				this.getCartNumber()
			}
			console.log(uni.getStorageSync('positionStorage'),'定位');
			let pickerPosition = uni.getStorageSync('pickerPosition')
			let positionStorage = uni.getStorageSync('positionStorage')
			if(pickerPosition){
				// this.area_marker = {
				// 	latitude:pickerPosition.latitude,
				// 	longitude: pickerPosition.longitude,
				// 	id:'tap',//仅仅用于删除的标识
				// 	iconPath:this.red_location, //显示的图标
				// 	rotate :0, // 旋转度数
				// 	width :32,//宽
				// 	height:32, //高
				// 	title :'区域中心',//标注点名
				// 	alpha:0.9 ,//透明度
				// 	callout :{ //自定义标记点上方的气泡窗口 点击有效
				// 		content: '区域中心', //文本
				// 		color: '#aa0000', //文字颜色
				// 		fontSize:14 , //文本大小
				// 		padding:10,
				// 		borderRadius: 2, //边框圆角
				// 		bgColor: '#f5f5f5', //背景颜色
				// 		display: 'BYCLICK', //常显
				// 	}
				// }
				if (positionStorage) { //有手动选择定位也有自动定位
					this.getBusineesLocations(pickerPosition.latitude,pickerPosition.longitude)
					this.latitude = pickerPosition.latitude  //中心经度
					this.longitude = pickerPosition.longitude //中心纬度
					this.mylatitude =  positionStorage.latitude //我的经度
					this.mylongitude = positionStorage.longitude//我的纬度
					this.district = pickerPosition.area
					
				} else { //有手动选择定位没有自动定位
					this.getBusineesLocations(pickerPosition.latitude,pickerPosition.longitude)
					this.latitude = pickerPosition.latitude //中心经度
					this.longitude = pickerPosition.longitude //中心纬度
					this.mylatitude =''
					this.mylongitude =''
					this.district = pickerPosition.area
				}
			}else{
				if(positionStorage) { //如果没有手动选择定位，有自动获取定位
					this.getBusineesLocations(positionStorage.latitude,positionStorage.longitude)
					this.latitude = positionStorage.latitude
					this.longitude = positionStorage.longitude
					this.mylatitude =  positionStorage.latitude
					this.mylongitude = positionStorage.longitude
					this.district = positionStorage.area
				} else { //如果没有手动选择定位，没有自动获取定位,给默认的
					this.latitude = this.latitude
					this.longitude = this.longitude
					// this.getuserPosition()
				}
			}
			// if(positionStorage){
			// 	this.mylocation = [{
			// 		id: 0,
			// 		latitude: this.mylatitude,
			// 		longitude: this.mylongitude,
			// 		iconPath: '../../static/map/location.png',
			// 		rotate: 0, // 旋转度数
			// 		width: 40, //宽
			// 		height: 40, //高
			// 		// title : '我的位置', //标注点名
			// 		callout:{ //自定义标记点上方的气泡窗口 点击有效
			// 			content: '您的位置', //文本
			// 			color: '#000', //文字颜色
			// 			fontSize:14 , //文本大小
			// 			padding:10,
			// 			borderRadius: 2, //边框圆角
			// 			bgColor: '#ffffff', //背景颜色
			// 			display: 'BYCLICK', //常显
			// 		},
			// 		alpha: 0.9, //透明度
			// 		label: {
			// 			content: '当前位置', //文本
			// 			color: '#000000', //文本颜色
			// 			fontSize: 14,
			// 			padding:2,
			// 			bgColor:'#ffffff', //背景颜色
			// 			x: -30,
			// 			y: 0
			// 		},
			// 	}]
			// }
			this.getBusineesLocations(this.latitude, this.longitude) //获取站点经纬度列表
		},
		// onReady() {
		// 	this.latitude = 21.195876
		// 	this.longitude = 110.399284
		// 	let _this= this
		// 	_this.poltline= [{
		// 		points:_this.pl,
		// 		arrowLine:true,
		// 		color:'#ff00dd',
		// 		width:5
		// 	}]
		// },
		methods: {
			markertap(e){
				console.log(e);
				if(e.detail.markerId == this.tapsite){  //点击同一个标记不让请求第二次
					return;
				}else{
					this.tapsite = e.detail.markerId
				}
				if(e.detail.markerId === 0 || e.detail.markerId =='tap'){return;} 
				this.AreaArray.map((item,index)=>{
					if(item.id == e.detail.markerId){
						item.iconPath = this.orange_location
					}else if (item.id !== 'tap'){
						item.iconPath = this.bule_location
					}
				})
				this.markers = this.AreaArray
				this.loading = true //显示加载动画
				this.getSiteDetail(e.detail.markerId)//获取标记点详情
			},
			getuserPosition(){
				let _this = this
				uni.getLocation({ //APP定位
					type: 'wgs84',
					geocode: true, //设置该参数为true可直接获取经纬度及城市信息，h5不支持解析地址信息
					success: function(res) {
						console.log(res)
						_this.mylatitude = res.latitude
						_this.mylongitude = res.longitude
						_this.district = '选择区域'
						let temp = {
							city:'',
							area:'',
							latitude: res.latitude,
							longitude: res.longitude
						}
						uni.setStorageSync('positionStorage', temp)
					},
					fail: function(e) {
						uni.showToast({
							icon:'none',
							title:'获取定位失败，请授权'
						})
						_this.district = '获取定位失败'
					}
				});
			},
			getSiteDetail(markerId) {
				this.loading = true
				this.$zshs.request('/web/users/recovery-classify', {
						mode: 'getBusinessInfo',
						user: 'common',
						action: 'info',
						id: markerId,
						latitude: this.latitude,
						longitude: this.longitude,
					}, 'POST')
					.then((res) => {
						console.log(res);
						let that = this
						if (res.code == 200) {
							if (res.data.code == 0) {
								setTimeout(() => {
									that.loading = false //隐藏加载动画
									that.hasData = true
								}, 400)
								that.siteData = res.data.userBs
							} else {
								that.siteData = []
							}
						} else {
							that.siteData = []
						}

					})
			},
			getBusineesLocations(lat,lng) { //获取站点经纬度
				this.$zshs.request('/web/users/recovery-classify', {
						action: 'coordinate',
						mode: 'getBusinessInfo',
						user: 'common',
						latitude: lat,
						longitude: lng,
					}, 'POST')
					.then((res) => {
						console.log(res);
						if (res.code == 200) {
							if (res.data.code == 0) {
								let that = this
								that.siteArray = res.data.userBs
								that.siteArray.map((item, index) => {
									item.iconPath = that.bule_location //显示的图标
									item.rotate = 0 // 旋转度数
									item.width = 32 //宽
									item.height = 32 //高
									// item.title = item.shop_name //标注点名
									item.alpha = 1 //透明度
									item.callout = { //自定义标记点上方的气泡窗口 点击有效
										content: item.shop_name, //文本
										color: '#F7A300', //文字颜色
										fontSize:14 , //文本大小
										padding:10,
										borderRadius: 2, //边框圆角
										bgColor: '#f5f5f5', //背景颜色
										display: 'BYCLICK', //常显
									}
								})
								
								//找出距离最近的站点
								let d_list = []
								that.siteArray.map((item)=>{
									d_list.push(item.distance)
								})
								// console.log(d_list)
								let shortdistance = d_list[0]
								for(let i = 0; i< d_list.length;i++){
									if(d_list[i] < shortdistance){
										shortdistance =  d_list[i]
									}
								}
								// console.log(shortdistance);
								let siteId = null
								that.siteArray.map(item=>{
									if(item.distance == shortdistance){
										siteId = item.id
									}
								})
								
								//根据id设置最近站点标记icon为橙色
								that.siteArray.map((item, index) => { 
									if (item.id == siteId) {
										item.iconPath = that.orange_location 
										item.isShortdistance = true  //标识这是距离最近的站点
									}else{
										item.isShortdistance = false
									}
								})
								
									//获取到站点列表，将我的位置图标和点击图标添加入markers
									// let templist = []
									// templist = that.mylocation.concat(that.siteArray)
									that.AreaArray =that.siteArray
									
									that.AreaArray.map((item,index)=>{
										if(item.id == 'tap'){
											that.AreaArray.splice(that.AreaArray.length-1,1)
										}
									})
									// if(that.area_marker){
									// 	that.AreaArray.push(that.area_marker)//添加标记
									// }
									console.log(that.AreaArray);
									that.markers = that.AreaArray
									//传最近的站点id请求该站点详情数据
									that.getSiteDetail(siteId) 
								// this.createdMarker() ---------------------------------------
							}
						}
					})
			},
			getCartNumber() { //获取回收车红点
				this.$zshs.request('/web/users/recovery-classify', {
						mode: "getOrderRecyclingCart",
						n: uni.getStorageSync('n'),
						user: "common",
						phone_key: uni.getStorageSync('clientId'),
					}, 'POST')
					.then((res) => {
						console.log(res);
						this.cartNumber = res.data.recycling_cart.length
					})
			},
			getMyLocation() { //恢复我的定位
				if(uni.getStorageSync('positionStorage')){
					this.latitude = uni.getStorageSync('positionStorage').latitude
					this.longitude = uni.getStorageSync('positionStorage').longitude
					this.getBusineesLocations(this.mylatitude, this.mylongitude)
					this.$refs.map.moveToLocation()
					
					uni.hideLoading()
				}else{
					let _this = this
					uni.showLoading()
					uni.getLocation({ //APP定位
						type: 'gcj02',
						geocode: true, //设置该参数为true可直接获取经纬度及城市信息，h5不支持解析地址信息
						success: function(res) {
							console.log(res)
							uni.hideLoading()
							let temp = {
								city:'',
								area:'',
								latitude: res.latitude,
								longitude : res.longitude
							}
							uni.setStorageSync('positionStorage', temp)
							this.mylatitude = res.latitude
							this.mylongitude = res.longitude
							this.latitude = res.latitude
							this.longitude = res.longitude
							this.$refs.map.moveToLocation(); 
						},
						fail: function(e) {
							console.log(e);
							uni.showToast({
								icon:'none',
								title:'获取定位失败，请授权获取手机定位'
							})
						}
					});
				}
			},
			// getMyLocation() { //复位
			// 	let _this = this
			// 	_this.isShowLocation =true
			// 	if(_this.mylatitude){
			// 		_this.latitude = _this.mylatitude
			// 		_this.longitude = _this.mylongitude
			// 		let mapContext = uni.createMapContext('map')
			// 		mapContext.moveToLocation()
			// 		_this.getBusineesLocations(_this.mylatitude,_this.mylongitude)
			// 	}else{
			// 		uni.getLocation({ //APP定位
			// 			type: 'wgs84',
			// 			geocode: true, //设置该参数为true可直接获取经纬度及城市信息，h5不支持解析地址信息
			// 			success: function(res) {
			// 				console.log(res)
			// 				_this.latitude =  res.latitude,
			// 				_this.longitude = res.longitude
			// 				_this.mylatitude =  res.latitude,
			// 				_this.mylongitude = res.longitude
			// 				_this.getBusineesLocations(res.latitude,res.longitude)
			// 				// let temp = {
			// 				// 	city:'',
			// 				// 	area:'',
			// 				// 	latitude: res.latitude,
			// 				// 	longitude: res.longitude
			// 				// }
			// 				// uni.setStorageSync('positionStorage', temp)
			// 			},
			// 			fail: function(e) {
			// 				console.log(e);
			// 				uni.showToast({
			// 					icon:'none',
			// 					title:'获取定位失败，请授权获取手机定位'
			// 				})
			// 			}
			// 		});
			// 	}
			// },
			confirm(e) {
				console.log(e);
				this.district = e.area.label
			},
			cancel() {
				this.$queue.showToast('定位失败，请选择一个城市')
			},
			showPicker() {
				this.$queue.navTo('/pages/areaPicker/areaPicker')
			},
			toCart(url) {
				if (this.$queue.getData('isLogin')) {
					this.$queue.navTo(url)
				} else {
					this.$queue.navTo('/pages/public/login')
				}
			},
			navTo(url) {
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		position: relative;
		overflow: hidden;
		height: calc(100vh - 90rpx);
	}

	#map {
		width: 750rpx;
		min-height: 100vh;
	}

	.top_header {
		width: 100%;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32rpx;
		position: fixed;
		top: 0;
		z-index: 999;
		background-color: #FFFFFF;

		.adress_position {
			display: flex;
			align-items: center;
			height: 60rpx;
			.position_icon {
				width: 32rpx;
				height: 32rpx;
				margin-right: 8rpx;
			}

			.adress_text {
				font-size: 26rpx;
				color: #3D3D3D;
				font-weight: 400;
				white-space: nowrap;
			}
		}

		.btn-view {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.recover-btn {
			padding: 10rpx 20rpx;
			border-radius: 30rpx;
			margin-right: 20rpx;
			background-color: #fed53b;
			font-size: 26rpx;
		}

		.cart_img {
			position: relative;
			width: 40rpx;
			height: 40rpx;
			line-height: 40rpx;
			margin-right: 10rpx;

			.cart_icon {
				width: 100%;
				height: 100%;
			}

			.red_number {
				min-width: 30rpx;
				// width: 30rpx;
				height: 30rpx;
				text-align: center;
				font-size: 24rpx;
				line-height: 30rpx;
				border-radius: 24rpx;
				color: #fff;
				background: #F76675;
				display: inline-block;
				position: absolute;
				top: -8rpx;
				right: -8rpx;
			}
		}


	}

	.map{
		width: 100vw;
		height: calc(100vh - 44px - 50px);
		margin-top: 88rpx;
	}

	.map {
		width: 100%;
		height: 100%;
	}

	/deep/.uni-map {
		height: 85vh;
	}

	.position_detail {
		width: 718rpx;
		max-height: 230rpx;
		position: absolute;
		bottom: 5vw;
		left: 2vw;
		padding: 4vw;
		width: 96vw;
		// height: 354rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.12);
		border-radius: 24rpx;

		// display: flex;
		// align-items: center;
		// justify-content: center;
		.company_view {
			display: flex;
			flex-direction: column;
		}

		.company_name {
			display: inline-block;
			font-family: PingFangSC-Medium;
			font-size: 32rpx;
			color: #3D3D3D;
			font-weight: bold;
			margin-bottom: 2vw;
		}

		.address {
			display: inline-block;
			max-width: 70vw;
			font-family: PingFangSC-Regular;
			font-size: 24rpx;
			color: #757575;
			font-weight: 400;
			margin-bottom: 2vw;
		}

		.distance {
			width: 20vw;
			display: flex;
			flex-direction: column;
			text-align: left;
			position: absolute;
			right: 0.5vw;
			top: 4vw;

			.distance_tips {
				height: 28rpx;
				font-family: PingFangSC-Regular;
				font-size: 10px;
				color: #F7A300;
				font-weight: 400;
				margin-bottom: 2vw;
			}

			.distance_number {
				height: 44rpx;
				display: inline-block;
				font-family: PingFangSC-Medium;
				font-size: 32rpx;
				color: #F7A300;
				text-align: left;
				font-weight: 600;
			}
		}

		.category {
			width: 100%;

			.category_item {
				height: 40rpx;
				font-size: 24rpx;
				padding: 0 1vw;
				display: inline-block;
				border: 2rpx solid #999999;
				border-radius: 4rpx;
				margin-right: 2vw;
				color: #999999;
			}
		}

		.nodata-tips {
			text-align: center;
			margin-top: 40rpx;
			margin-bottom: 40rpx;
		}

		.position-btn {
			width: 72rpx;
			height: 72rpx;
			border-radius: 72rpx;
			background-color: #FFFFFF;
			position: fixed;
			right: 30rpx;
			bottom: 370rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.position-img {
				width: 48rpx;
				height: 48rpx;
				border-radius: 48rpx;
			}
		}

		.subscribe_btn {
			width: 100%;
			height: 80rpx;
			background: #FFD426;
			text-align: center;
			line-height: 80rpx;
			background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, #F7A300 100%);
			border-radius: 44rpx;
			margin-top: 6vw;
			font-size: 32rpx;
			color: #3D3D3D;
			font-weight: bold;
		}
	}

	.loading-view {
		width: 160rpx;
		height: 150rpx;
		margin: 0 auto;
		// margin-top: 80rpx;
		color: #646464;
		// background-color: rgba(0, 0, 0, 0.6);
		border-radius: 20upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 动画样式 */
	.loading {
		border: 10upx solid rgba(0, 0, 0, 0.01);
		border-radius: 50%;
		border-top: 6upx solid #646464;
		border-right: 6upx solid #646464;
		border-bottom: 6upx solid #646464;
		width: 30upx;
		height: 30upx;
		margin-right: 20rpx;
		-webkit-animation: spin 1.4s linear infinite;
		animation: spin 1.4s linear infinite;
	}

	@-webkit-keyframes spin {
		0% {
			-webkit-transform: rotate(0deg);
		}

		100% {
			-webkit-transform: rotate(360deg);
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
