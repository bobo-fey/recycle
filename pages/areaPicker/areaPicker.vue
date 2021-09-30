<template>
	<view class="content">
		<view class="title-bar">
			<!-- #ifdef APP-PLUS -->
			<view class="empty"></view>
			<!-- #endif -->
			<view class="title-view">
				<view class="left" @click="back()">
					<image src="../../static/order/back_btn.png" mode="aspectFill"></image>
				</view>
				<view class="middle">选择区域</view>
				<view class="right" ></view>
			</view>
		</view>
		<view class="tophead-view">
			<view class="tips">
				<text>您目前位置：</text>
				<text class="city">{{cityName}}</text>
				<text class="area">{{areaName}}</text>
			</view>
			<view class="picker_text" @click="showPicker">
				<text>选择县区</text>
			</view>
		</view>
		<view class="mian-view">
			<view class="visited">
				<view class="visited-header">
					<view class="visited-title">
						定位/最近访问
					</view>
					<view class="clear" @click="clearHistory">
						清除记录
					</view>
				</view>
				<view class="visited-view">
					<view class="item-view" v-for="(item,index) in historyList" :key="index" @click="tap(item,index)">
						<view class="position_img" v-if="index==0">
							<image src="../../static/map/orange_location.png" mode="aspectFill"></image>
						</view>
						<view class="address_text">
							{{item.area}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="position-picker">
			<u-picker mode="multiSelector" v-model="picker_show" :default-selector='default_select' :range="arrDate"
				range-key="label" @confirm="bindDateChange" @columnchange="columnchange">
			</u-picker>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				picker_show: false,
				arrDate: [[],[]],
				default_select: [0, 0],
				cityList: [], //城市列表
				areaList: [], //区县列表
				province: '广东',
				cityName: '湛江市',
				areaName: '霞山区',
				c_city: '湛江市', //缓存用于获取县区级列表数据
				historyList:[],//历史记录
			}
		},
		onLoad() {
			this.historyList = this.$queue.getData('p_history') || []
			console.log(this.historyList);
			if (this.$queue.getData('pickerPosition')) { //先判断是否手动选择定位
				this.c_city = this.$queue.getData('pickerPosition').city
				this.cityName = this.$queue.getData('pickerPosition').city
				this.areaName = this.$queue.getData('pickerPosition').area
			} else {
				if (this.$queue.getData('positionStorage')) { //如果没有手动选择定位，判断是否自动获取定位，没有自动获取则手动去定位
					this.c_city = this.$queue.getData('positionStorage').city
					this.cityName = this.$queue.getData('positionStorage').city
					this.areaName = this.$queue.getData('positionStorage').area
				} else {
					this.cityName = '请手动选择一个回收区域！'
					this.areaName = ''
				}
			}
			this.getcityList()
		},
		// onBackPress(options) {
		// 	if (options.from === 'backbutton') {
		// 		this.$zshs.request('/web/users/recovery-classify',{ //有自动定位，后端判断是否存在定位的数据
		// 			mode: 'getLocation',
		// 			user : 'common',
		// 			action:'getCoordinate',
		// 			county:this.areaName,
		// 		},'POST')
		// 		.then(res=>{
		// 			console.log(res);
		// 			if(res.code == 200){
		// 				if(res.data.code ==0){
		// 					uni.navigateBack({})
		// 				}else{
		// 					uni.showToast({
		// 						icon:'none',
		// 						title:'请选择一个县区以便给您提供更好的服务！'
		// 					})
		// 				}
		// 			}
		// 		})
		// 		// 禁止默认返回
		// 		return true;
		// 	}
		// },
		methods: {
			tap(item,i){//点击记录
				this.historyList.splice(i,1)
				this.historyList.unshift(item)
				this.$queue.setData('p_history',this.historyList)
				this.$queue.setData('pickerPosition', item)
				uni.navigateBack({})
			},
			clearHistory(){ //清除记录
				uni.removeStorageSync('p_history')
				this.historyList = this.$queue.getData('p_history') || []
			},
			bindDateChange(e) {
				console.log(e);
				this.cityName = this.c_city
				this.areaName = this.areaList[e[1]].label
				let lat = this.areaList[e[1]].coordinate.split(',')[0]
				let lng = this.areaList[e[1]].coordinate.split(',')[1]
				let temp = {
					city: this.cityName,
					area: this.areaName,
					latitude: lat,
					longitude: lng
				}
				this.$queue.setData('pickerPosition', temp)
				this.historyList.map((item,i)=>{
					if(item.area == temp.area){
						console.log(i);
						this.historyList.splice(i,1)
					}
				})
				this.historyList.unshift(temp)
				this.$queue.setData('p_history',this.historyList)
				uni.navigateBack({})
			},
			columnchange(e) {
				if (e.column == 0) { //u-picker多列联动需要修改default_select的值才可以起到联动效果
					this.default_select[0] = e.index
					this.c_city = this.cityList[e.index].label //赋值c_city获取新的县区
					this.getAreaList(this.c_city)
					this.arrDate[1] = this.areaList
				} else {
					this.default_select[1] = e.index
				}
			},
			showPicker() {
				this.picker_show = true
				this.cityList.forEach((item,index)=>{
					if(item.label == this.cityName){
						console.log(index)
						console.log(item.label);
						this.default_select[0] =index
					}
				})
				this.areaList.forEach((item,index)=>{
					if(item.label == this.areaName){
						console.log(index)
						console.log(item.label);
						this.default_select[1] =index
					}
				})
			},
			getcityList() {
				this.$zshs.request('/web/users/recovery-classify', {
						mode: 'getLocation',
						user: 'common',
						action: 'getCity',
						province: this.province
					}, 'POST')
					.then(res => {
						console.log(res);
						if (res.code == 200) {
							if (res.data.code == 0) {
								this.cityList = res.data.cities
								this.getAreaList(this.cityList[0].label)
							}
						}
					})
			},
			getAreaList(temp) {
				let that = this
				console.log('11111111111');
				that.$zshs.request('/web/users/recovery-classify', {
						mode: 'getLocation',
						user: 'common',
						action: 'getCounty',
						city: temp
					}, 'POST')
					.then(res => {
						console.log(res);
						if (res.code == 200) {
							if (res.data.code == 0) {
								that.areaList = res.data.counties
								that.arrDate = [that.cityList, that.areaList]
								that.$forceUpdate()
								console.log(that.arrDate);
							}
						}
					})
			},
			back(){
				uni.navigateBack({})
				// this.$zshs.request('/web/users/recovery-classify',{ //有自动定位，后端判断是否存在定位的数据
				// 	mode: 'getLocation',
				// 	user : 'common',
				// 	action:'getCoordinate',
				// 	county:this.areaName,
				// },'POST')
				// .then(res=>{
					
				// 	console.log(res);
				// 	if(res.code == 200){
				// 		if(res.data.code ==0){
				// 			uni.navigateBack({})
				// 		}else{
				// 			uni.showToast({
				// 				icon:'none',
				// 				title:'请选择一个县区以便给您提供更好的服务！'
				// 			})
				// 		}
				// 	}
				// })
				// .catch((ress)=>{
				// 	console.log(ress);
				// })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		overflow: hidden;
		width: 100vw;
		background-color: #f1f5f6;
		min-height: 100vh;
	}
	.title-bar {
		position: fixed;
		top: 0;
		left: 0;
	}
	
	.empty {
		width: 100vw;
		height: 60rpx;
		background-color: #fdc804;
	}
	
	.title-view {
		width: 100vw;
		height: 88rpx;
		background: #fdc804;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 32rpx;
	
		.left {
			width: 40rpx;
			height: 40rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
	
		.middle {
			font-size: 32rpx;
			color: #3D3D3D;
			font-weight: bold;
		}
	
		.right {
			width: 40rpx;
			height: 40rpx;
		}
	}
	.tophead-view {
		
		margin-top: 116rpx;
		/*#ifdef APP-PLUS*/
		margin-top: 176rpx;
		/*#endif*/
		width: 100%;
		padding: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #FFFFFF;

		.tips {
			font-size: 30rpx;
			font-weight: 800;

			.city {
				margin-right: 20rpx;
			}
		}

		.picker_text {
			font-size: 26rpx;
			color: #646464;
		}

	}

	.mian-view {
		width: 100%;
		display: flex;
		flex-direction: column;

		.visited {
			display: flex;
			flex-direction: column;
			.visited-header{
				padding: 20rpx 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.visited-title {
					font-size: 28rpx;
					font-weight: 700;
					color: #919296;
					
				}
				.clear{
					
				}
			}
			

			.visited-view {
				margin-top: 20rpx;
				padding: 0 30rpx;
				display: flex;
				// justify-content: space-between;
				flex-wrap: wrap;

				.item-view {
					display: flex;
					align-items: center;
					justify-content: center;
					width: calc((100vw - 120rpx)/4);
					color: #000;
					font-size: 28rpx;
					height: 70rpx;
					border-radius: 10rpx;
					background-color: #FFFFFF;
					margin-bottom: 20rpx;
					margin-right: 20rpx;

					&:nth-child(4n) {
						margin-right: 0rpx;
					}

					.position_img {
						width: 30rpx;
						height: 30rpx;
						line-height: 30rpx;
						margin-right: 4rpx;
						border-radius: 30rpx;
						overflow: hidden;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}
	}
</style>
