<template>
	<view class="content">
		<!-- 定位与回收 -->
		<view class="fixed_view">
			<!-- 占位符 -->
			<view class="empty_view"></view>
			<view class="top_header">
				<view class="adress_position" @click="toPicker">
					<image class="position_icon" src="../../static/dinwei.png" mode="aspectFill"></image>
					<view class="adress_text">{{district}}</view>
				</view>
				<view class="cart_img" @click="navTo('/pages/cart/cart')">
					<image class="cart_icon" src="../../static/huishouche.png" mode="aspectFill"></image>
					<view class="red_number" v-if="cartNumber > 0 ">{{cartNumber}}</view>
				</view>
			</view>
		</view>

		<view class="top_view">
			<!-- 轮播图 -->
			<view class="swiper_view">
				<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :disable-touch="distouch"
					:duration="duration">
					<swiper-item v-for="(item,index) in imgList" :key="index">
						<view class="swiper-item" >
							<image :src="item" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>

		<!-- 底部内容 -->
		<view class="bot_bg">
			<!-- 平台 -->
			<view class="platform">
				<view class="platform_title">
					互联网家电回收行业开拓者
				</view>
				<view class="platform_content">
					本地最专业的线上家电回收综合服务平台
				</view>
				<view class="platform_Img">
					<image src="../../static/pc_image.jpg" mode="aspectFill"></image>
				</view>
			</view>

			<!-- 常见问题 -->
			<view class="problem_view">
				<view class="pro_title">常见问题</view>
				<view class="pro_box">
					<view class="pro_question">Q：家电回收的服务流程是什么？</view>
					<view class="pro_answer">A：您可以通过线上下单，回收员接单后联系您预约上门检测回收，确认回收后现场支付回收款。</view>
				</view>
				<view class="pro_box">
					<view class="pro_question">Q：上门回收是否安全？</view>
					<view class="pro_answer">A：线上接单回收商经过回收猿官方企业认证，上门回收员也需经过实名认证，可靠安全。</view>
				</view>
				<view class="pro_box">
					<view class="pro_question">Q：旧电器被回收后，里面的个人隐私会不会泄露？</view>
					<view class="pro_answer">A：回收商已经过平台严格的资质审核，并在约定的时间上门回收。</view>
				</view>
				<view class="pro_box">
					<view class="pro_question">Q：旧电器回收价格是怎么定的？</view>
					<view class="pro_answer">A：回收价格受市场行情、电器新旧程度、使用情况等因素影响，需由回收员现场估价。若回收价过低，您有权取消回收。</view>
				</view>
				<view class="pro_box">
					<view class="pro_question">Q：你们收的旧电器去哪了？</view>
					<view class="pro_answer">A：成色较新的电器在正规的二手渠道中售卖或慈善捐赠，成色较差或功能残缺的电器进行环保拆解回收。</view>
				</view>
				<view class="knowmore" >
					<text class="more" @click="kownMore('/pages/article_page/knownMore')">了解更多问题</text>
				</view>
			</view>
		</view>

		<!-- 预约回收 -->
		<view class="bot_view">
			<view class="subscribe_view">
				<view class="subscribe_button" @click="toRrcycle('/pages/createdOrder/chooseType')">预约回收</view>

				<view class="process">
					<view class="process-item">
						<view class="process_img">
							<!-- <svg class="process_icon">
								<use xlink:href="#hsxiadan"></use>
							</svg> -->
							<image class="process_icon" src="../../static/home/xiadan.png" mode="aspectFill"></image>
						</view>
						<view class="process_des">线上下单</view>
					</view>
					<view class="process-item">
						<view class="process_img">
							<image class="dian_icon" src="../../static/home/dian.png" mode="aspectFill"></image>
						</view>
					</view>

					<view class="process-item">
						<view class="process_img">
							<image class="process_icon" src="../../static/home/shangmen.png" mode="aspectFill"></image>
						</view>
						<view class="process_des">上门服务</view>
					</view>
					<view class="process-item">
						<view class="process_img">
							<image class="dian_icon" src="../../static/home/dian.png" mode="aspectFill"></image>
						</view>
					</view>

					<view class="process-item">
						<view class="process_img">
							<image class="process_icon" src="../../static/home/huishou.png" mode="aspectFill"></image>
						</view>
						<view class="process_des">检测回收</view>
					</view>
					<view class="process-item">
						<view class="process_img">
							<image class="dian_icon" src="../../static/home/dian.png" mode="aspectFill"></image>
						</view>
					</view>

					<view class="process-item">
						<view class="process_img">
							<image class="process_icon" src="../../static/home/xiadan.png" mode="aspectFill"></image>
						</view>
						<view class="process_des">当面付款</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getAES,getDAes} from '@/common/crypto.js'
	export default {
		data() {
			return {
				distouch:false,
				indicatorDots: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				district: '霞山区',
				params: {
					province:true,
					city:true,
					area:true
				},
				imgList:['../../static/swiper.png'],
				cartNumber:0,
			}
		},
		onLoad() {
			if(this.imgList.length <=1){   //轮播图少于2张时禁止滑动
				this.distouch =true
			}
			// #ifdef APP-PLUS
			if(uni.getStorageSync('nofirstOpen')){  //app端需要设置变量，第一次进入首页不执行判断是否定位跳转定位页面，防止和首次启动引导页冲突
				if (this.$queue.getData('pickerPosition')) { //有手动选择定位
					console.log('选择定位');
					this.district= this.$queue.getData('pickerPosition').area
				}else{
					// setTimeout(()=>{ //使用定时器，一秒后判断是否获取到定位
					// console.log(this.$queue.getData('positionStorage'),'获取定位');
					// 	if (this.$queue.getData('positionStorage')) { //有手动选择定位，自动获取定位
					// 		this.district = this.$queue.getData('positionStorage').area
					// 		this.$zshs.request('/web/users/recovery-classify',{ //有自动定位，后端数据判断是否存在定位的数据
					// 			mode: 'getLocation',
					// 			user : 'common',
					// 			action:'getCoordinate',
					// 			county:this.district,
					// 		},'POST')
					// 		.then(res=>{
					// 			// console.log(res);
					// 			if(res.code == 200){
					// 				if(res.data.code ==0){
					// 					console.log('后端数据存在该定位');
					// 					// console.log(res.data);
					// 					this.district = this.$queue.getData('positionStorage').area
					// 				}else{
					// 					setTimeout(()=>{  //防止页面连续跳转报红
					// 						uni.navigateTo({
					// 							url:'/pages/areaPicker/areaPicker'
					// 						})
					// 					},1000)
					// 				}
					// 			}
					// 		})
					// 	} else {
					// 		this.getUserPosition() //获取定位
					// 	}
					// },1200)
				}
			}else{
				uni.setStorageSync('nofirstOpen',true)
			}
			// #endif
			// #ifdef H5
				if (this.$queue.getData('pickerPosition')) { //有手动选择定位
					console.log('手动选择定位');
					this.district= this.$queue.getData('pickerPosition').area
				}else{
					setTimeout(()=>{
					uni.navigateTo({
						url:'/pages/areaPicker/areaPicker'
					})
					},1500)
					// setTimeout(()=>{ //使用定时器，一秒后判断是否获取到定位
					// console.log(this.$queue.getData('positionStorage'),'获取定位成功');
					// 	if (this.$queue.getData('positionStorage')) { //有手动选择定位，自动获取定位
					// 		this.district = this.$queue.getData('positionStorage').area
					// 		this.$zshs.request('/web/users/recovery-classify',{ //有自动定位，后端数据判断是否存在定位的数据
					// 			mode: 'getLocation',
					// 			user : 'common',
					// 			action:'getCoordinate',
					// 			county:this.district,
					// 		},'POST')
					// 		.then(res=>{
					// 			// console.log(res);
					// 			if(res.code == 200){
					// 				if(res.data.code ==0){
					// 					console.log('后端数据存在该定位');
					// 					// console.log(res.data);
					// 					this.district = this.$queue.getData('positionStorage').area
					// 				}else{
					// 					setTimeout(()=>{  //防止页面连续跳转报红
					// 						uni.navigateTo({
					// 							url:'/pages/areaPicker/areaPicker'
					// 						})
					// 					},1000)
					// 				}
					// 			}
					// 		})
					// 	} else {
					// 		this.getUserPosition() //获取定位
							
					// 		// this.getUserLoction()
					// 	}
					// },1200)
				}
			// #endif
		},
		onShow() {
			// console.log(this.$queue.getData('pickerPosition'));
			if (this.$queue.getData('pickerPosition')) { //有手动选择定位
				// console.log(this.$queue.getData('pickerPosition'));
				this.district= this.$queue.getData('pickerPosition').area
			}
			
			if(this.$queue.getData('isLogin')){
				this.getCartNumber()  //回收车数目
			}
		},
		onHide() {
			uni.setStorageSync('nofirstOpen',true)
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh()
		},
		methods: {
			getUserPosition(){
				let _this = this
				uni.getLocation({ //APP定位
					// #ifdef APP-PLUS
					type: 'gcj02',
					// #endif
					// #ifdef H5
					type: 'wgs84',
					// #endif
					geocode: true, //设置该参数为true可直接获取经纬度及城市信息，h5不支持解析地址信息
					success: function(res) {
						console.log(res,'获取定位成功')
						// #ifdef APP-PLUS
						let temp = {
							city:res.address.city,
							area:res.address.district,
							latitude: res.latitude,
							longitude: res.longitude
						}
						// #endif
						// #ifdef H5
						let temp = {
							city:'',
							area:'',
							latitude: res.latitude,
							longitude: res.longitude
						}
						_this.district= '选择区县'
						// #endif
						
						uni.setStorageSync('positionStorage', temp)
						// let historyList =  _this.$queue.getData('p_history')|| []
						// historyList.map((item,i)=>{
						// 	if(item.area == temp.area){
						// 		console.log(i);
						// 		historyList.splice(i,1)
						// 	}
						// })
						// historyList.unshift(temp)
						// _this.$queue.setData('p_history',historyList)
					},
					fail: function(e) {
						console.log(e);
						_this.district = '获取定位失败,请手动选择定位'
							setTimeout(()=>{  //防止页面连续跳转，报红
								uni.navigateTo({
									url:'/pages/areaPicker/areaPicker'
								})
							},1000)
					}
				});
			},
			getCartNumber(){
				this.$zshs.request('/web/users/recovery-classify',{
					mode: "getOrderRecyclingCart",
					n: this.$queue.getData('n'),
					user: "common",
					phone_key: this.$queue.getData('clientId'),
				},'POST')
				.then((res)=>{
					console.log(res);
					this.cartNumber = res.data.recycling_cart.length
				})
			},
			confirm(e){
				console.log(e);
				this.district = e.area.label
			},
			cancel(){
				this.$queue.showToast('定位失败，请选择一个城市')
			},
			toPicker(){
				uni.navigateTo({
					url:'/pages/areaPicker/areaPicker'
				})
			},
			bindDateChange(event){
				// console.log(event);
				// console.log(this.areaList);
				this.district = this.areaList[event[1]].label
				let site = this.areaList[event[1]].coordinate
				let lat = parseFloat( site.split(',')[0])
				let lng = parseFloat( site.split(',')[1])
				console.log(lat);
				console.log(lng);
				let temp = {
					district:this.district,
					latitude:lat,
					longitude:lng
				}
				uni.setStorageSync('positionStorage',temp)
			},
			kownMore(url){
				uni.navigateTo({
					url: url
				})
			},
			toRrcycle(url){
				this.$queue.navTo(url)
			},
			navTo(temp) {
				if(this.$queue.getData('isLogin')){
					this.$queue.navTo(temp)
				}else{
					this.$queue.navTo('/pages/public/login')
				}
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		height: calc(100vh- 44px);
		overflow: hidden;
	}

	.fixed_view {
		width: 100vw;
		position: fixed;
		top: 0;
		z-index: 999;

		/*#ifdef APP-PLUS*/
		.empty_view {
			width: 100vw;
			height: 60rpx;
			background-color: $uni-mbg-color;
		}
		/*#endif*/
		/*#ifdef MP-WEIXIN*/
		.empty_view {
			width: 100vw;
			height: 120rpx;
			background-color: $uni-mbg-color;
		}
		/*#endif*/
		.top_header {
			height: 88rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 32rpx;
			background-color: $uni-mbg-color;

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
				}
			}

			.cart_img {
				position: relative;

				.cart_icon {
					width: 40rpx;
					height: 40rpx;
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
	}

	.top_view {
		width: 100%;
		background-color: $uni-mbg-color;
		opacity: 1;
		margin-top: 88rpx;
		/*#ifdef APP-PLUS || MP-WEIXIN*/
		margin-top: 147rpx;

		/*#endif*/
		.swiper_view {
			width: 100vw;
			height: 800rpx;

			.swiper {
				width: 100%;
				height: 100%;

				.swiper-item {
					width: 100%;
					height: 100%;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		/deep/.uni-swiper-dots-horizontal {
			bottom: 25%;
		}
	}

	.bot_bg {
		width: 100vw;
		background-color: #f5f5f5;
		overflow: hidden;
		padding: 0 20rpx;

		.platform {
			width: 100%;
			height: 384rpx;
			margin: 0 auto;
			margin-top: 180rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			padding: 40rpx;

			.platform_title {
				width: 100%;
				height: 44rpx;
				font-family: PingFangSC-Medium;
				font-size: 32rpx;
				color: #3D3D3D;
				font-weight: 500;
				margin-bottom: 10rpx;

			}

			.platform_content {
				width: 100%;
				height: 34rpx;
				font-family: PingFangSC-Regular;
				font-size: 24rpx;
				color: #646464;
				font-weight: 400;
				margin-bottom: 40rpx;
			}

			.platform_Img {
				width: 100%;
				height: 200rpx;
				border-radius: 12rpx;
				overflow: hidden;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.problem_view {
			width: 100%;
			min-height: 740rpx;
			margin: 30rpx auto;
			background: #FFFFFF;
			border-radius: 24rpx;
			padding: 20rpx 30rpx;

			.pro_title {
				width: 128rpx;
				height: 44rpx;
				font-family: PingFangSC-Medium;
				font-size: 32rpx;
				color: #343434;
				text-align: left;
				font-weight: bold;
			}

			.pro_box {
				width: 100%;
				margin: 40rpx 0;
				text-align: left;

				.pro_question {
					width: 100%;
					min-height: 34rpx;
					font-family: PingFangSC-Semibold;
					font-size: 24rpx;
					color: #3D3D3D;
					font-weight: bold;
				}

				.pro_answer {
					width: 654rpx;
					min-height: 34rpx;
					font-family: PingFangSC-Regular;
					font-size: 24rpx;
					color: #646464;
					font-weight: 400;
				}
			}

			.knowmore {
				width: 100%;
				margin: 0 auto;
				text-align: center;

				.more {
					width: 144rpx;
					height: 34rpx;
					margin-top: 20rpx;
					font-family: PingFangSC-Regular;
					font-size: 24rpx;
					color: #F7A300;
					font-weight: 400;
				}
			}
		}

	}

	.bot_view {
		width: 100vw;
		position: absolute;
		top: 720rpx;
		/*#ifdef APP-PLUS*/
		top: 780rpx;
		/*#endif*/

		.subscribe_view {
			width: 95.7%;
			height: 314rpx;
			// padding: 32rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			margin: 0 auto;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.subscribe_button {
				width: 87.2%;
				height: 88rpx;
				background: #FFD426;
				background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, #F7A300 100%);
				border-radius: 44rpx;
				text-align: center;
				line-height: 88rpx;
				color: #3D3D3D;
				font-weight: bold;
				font-size: 32rpx;


			}

			.process {
				width: 73.6%;
				margin-top: 32rpx;
				display: flex;
				justify-content: space-between;

				.process-item {
					width: 12.8%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.process_img {
						.process_icon {
							width: 56rpx;
							height: 56rpx;
						}

						.dian_icon {
							width: 32rpx;
							height: 32rpx;
						}
					}

					.process_des {
						height: 28rpx;
						font-family: PingFangSC-Regular;
						font-size: 24upx;
						color: #646464;
						white-space: nowrap;
					}
				}
			}
		}



	}
</style>
