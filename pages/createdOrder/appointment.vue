<template>
	<view class="content">
		<view class="back-btn" @click="navBack">
			<image src="../../static/left_btn.png" mode="aspectFill"></image>
		</view>
		<view class="appoint-view">
			<view class="appoint-text">预约服务</view>
			<view class="tips">
				回收商接单后会在24小时联系您，并预约上门服务
			</view>
		</view>
		<view class="parameter-view">
			<view class="parameter-item isUrgent">
				<view class="parameter-name">
					{{urgentdata.type}}
				</view>
				<view class="parameter-child">
					<view class="child-item" :class="c_item.select ? 'active' : ''"
						v-for="(c_item,c_index) in urgentdata.child" :key="c_index" @click="selectItem(c_index)">
						{{c_item.label}}
					</view>
				</view>
			</view>
			<view class="parameter-item requirement" >
				<view class="parameter-name">
					{{requiredata.type}}
				</view>
				<view class="parameter-child">
					<view class="child-item" :class="c_item.checked ? 'active' : ''"
						v-for="(c_item,c_index) in requiredata.child" :key="c_index" @click="checkedRequired(c_item)">
						{{c_item.label}}
					</view>
				</view>
			</view>
			<view class="address-view">
				<view class="address-text">
					回收地址
				</view>
				<!-- 地址管理列表中没有地址显示添加符号 ，跳转地址编辑 -->
				<view class="add-address" @click="navTo('/pages/address/addressEdit?pagesfrom=' + p_from)"
					v-if="addressList.length == 0">
					<image src="../../static/add.png" mode="aspectFill"></image>
				</view>
				<view class="address-detail" v-if="addressList.length > 0">
					<view class="address-box">
						<view class="person">
							{{beforePageData.name + `(`+ beforePageData.phone_no +`)`}}
						</view>
						<view class="address-text">
							{{beforePageData.province + beforePageData.city + beforePageData.district +beforePageData.address }}
						</view>
					</view>
					<view class="alter" @click="navTo('/pages/address/address?pagesfrom=' + p_from + '&a_id=' + beforePageData.id)">
						修改
					</view>
				</view>
			</view>
		</view>
		<view class="next-btn" @click="keep">
			<text class="next-text">提交</text>
		</view>
		
		<view class="guide" @touchmove.stop.prevent="moveHandle" v-if="showGuide">
			<view class="skip" @click.stop="jump">
				跳过
			</view>
			<view :style="getStyle" class="guide-box" catchtouchmove="true">
				<view class="tips" :style="{left: guideInfo.tipStyle.left,top:guideInfo.tipStyle.top}" v-if="tipsShow" @click.stop="next">
					<view class="text">{{ guideInfo.tips }}</view>
					<view class="next">
						<text  @click.stop="readMoreTime" class="readagain" v-if="index==3">再看一遍</text>
						<text >{{ guideInfo.next }}</text>
					</view>
				</view>
				<view class="arrow"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				p_from: '1',  //标记这个页面的标识为'1'
				datalist: [], //需求列表数据
				beforePageData: null, //编辑地址addressEdit返回的数据--使用页面栈改变上个页面的data数据
				dataChange:false,  //判断数据是否改变
				addressList: [], //地址列表数据
				urgentdata:{}, //是否加急
				requiredata:{} ,//服务需求
				urgent:2,  //默认为正常回收 正常回收：2；加急回收：1；
				prepages:''   ,//上个页面的标识 默认空为正常预约回收， '1':回收车
				
				g_width: '',
				g_height: '',
				g_top: '',
				g_left: '',
				showGuide: false,
				tipsShow:true,
				index: 0,
				guideList: [{
					tips: '可选择是否需要加急回收', // 提示文字
					next: '下一步', // 下一步按钮显示文字
					tipStyle: { // tips样式
						top: '200rpx',
						left: '4rpx'
					}
				}, {
					tips: '是否有其他服务要求',
					next: '下一步',
					tipStyle: {
						top: '380rpx',
						left: '10rpx'
					}
				}, {
					tips: '选择或者添加回收地址',
					next: '下一步',
					tipStyle: {
						top: '-170rpx',
						left: '24rpx',
					}
				}, {
					tips: '最后，点击“提交”,创建订单成功',
					next: '我明白了！',
					tipStyle: {
						top: '-170rpx',
						left: '60rpx',
					}
				}],
				re_data:null,//重新下单传参
			}
		},
		computed: {
			guideInfo() {
				return this.guideList[this.index];
			},
			getStyle() {
				return {
					width: this.g_width + 'px',
					height: this.g_height + 'px',
					left: this.g_left + 'px',
					top: this.g_top + 'px',
					bottom: this.g_bot + 'px',
					boxShadow: 'rgb(33 33 33 / 80%) 0px 0px 0px 0px, rgb(33 33 33 / 50%) 0px 0px 0px 5000px'
				}
			},
		
		},
		onLoad(options) {
			this.getappointList()
			if(options.re_orderdata){//重新下单携带的参数
				console.log(options.re_orderdata);
				this.re_data = JSON.parse(options.re_orderdata)
				// console.log(this.urgentdata);
				this.prepages = '3'
			}
			if(options.prepages){
				this.prepages = options.prepages
			}
			// #ifdef APP-PLUS
			//步骤引导
			 this.showGuide = this.$queue.getData('hasGuide') ? false : true  //hasGuide为true的时候表示引导过了隐藏引导为false
			// #endif
		},
		onShow() {
			console.log('111',this.beforePageData);
			this.getaddressList()
		},
		onReady() {
			if(this.showGuide){
				let _this = this;
				// 计算组件的高度
				let view = uni.createSelectorQuery().select('.isUrgent'); //元素的页面参数
				setTimeout(()=>{
					view.boundingClientRect(data => {
						_this.g_width = data.width +10
						_this.g_height = 80
						_this.g_top = data.top -5
						_this.g_left = data.left - 5
					}).exec();
				},100)
			}
		},
		methods: {
			jump(){
				this.$queue.setData('hasGuide',true) //缓存数据，该用户已经经过新手引导
				// setTimeout(()=>{
					uni.redirectTo({
						url:"/pages/createdOrder/chooseType"
					})
				// },1000)
			},
			readMoreTime(){
				uni.redirectTo({
					url:"/pages/createdOrder/chooseType"
				})
			},
			next(){
				this.g_width = 0
				this.g_height = 0
				this.tipsShow = false
				if (this.index === this.guideList.length - 1) {
					// this.showGuide = false;
					this.$queue.setData('hasGuide',true) //缓存数据，该用户已经经过新手引导
					setTimeout(()=>{
						uni.redirectTo({
							url:"/pages/createdOrder/chooseType"
						})
					},1000)
				} else {
					this.index += 1;
					if (this.index == 1) {
						let _this = this;
						// 计算组件的高度
						let view = uni.createSelectorQuery().select('.requirement'); //元素的页面参数
						view.boundingClientRect(data => {
							// console.log(data);
							setTimeout(()=>{
								_this.g_width = data.width + 10
								_this.g_height = data.height
								_this.g_top = data.top
								_this.g_left = data.left - 5
								this.tipsShow = true
							},200)
						}).exec();
					} else if(this.index == 2){
						let _this = this;
						// 		// 计算组件的高度
						let view1 = uni.createSelectorQuery().select('.address-view'); //元素的页面参数
						view1.boundingClientRect(data => {
							_this.g_width = data.width + 10
							_this.g_height = data.height + 10
							_this.g_top = data.top - 5
							_this.g_left = data.left - 5
							this.tipsShow = true
						}).exec();
					}else {
						let _this = this;
						// 		// 计算组件的高度
						let view2 = uni.createSelectorQuery().select('.next-btn'); //元素的页面参数
						view2.boundingClientRect(data => {
							_this.g_width = data.width
							_this.g_height = 70
							_this.g_top = data.top
							_this.g_left = data.left
							this.tipsShow = true
						}).exec();
					}
				}
			},
			getappointList() {
				uni.showLoading()
				this.$zshs.request('/web/users/recovery-classify', {
						mode: 'getLabels',
						user: 'common'
					}, 'POST')
					.then((res) => {
						console.log(res)
						if (res.code == 200) {
								uni.hideLoading()
								this.datalist = res.data 
								this.urgentdata = res.data[0]
								this.requiredata = res.data[1]
								this.urgentdata.child.map((item, key) => {
									if(this.re_data){
										if(this.re_data.urgent == item["label_classify"]){
											item["select"] = true
										}else{
											item["select"] = false
										}
									}else{
										key == 0 ? item["select"] = true : item["select"] = false
									}
								})
								this.requiredata.child.map((item, key) => {
									if(this.re_data){
										let d_list = this.re_data.order_describe.split(',')
										d_list.map((d_item,d_index)=>{
											if(d_item == item.label){
												item.checked = true
											}
										})
									}else{
										item.checked = false
									}
								})
								console.log(this.urgentdata);
								console.log(this.requiredata);
						}
					})
			},
			getaddressList() {
				let n_id = this.$queue.getData('n')
				let p_key = this.$queue.getData('clientId')
				console.log(n_id, p_key);
				this.$zshs.request('/web/users/account', {
						mode: "getAddress",
						user: "common",
						n: n_id,
						phone_key: p_key
					}, 'POST')
					.then((res) => {
						console.log(res);
						if(res.code == 200){
							// if (res.data.code ==0) {
								this.addressList = res.data
								if(this.dataChange){  //选择地址,this.beforePageData改变，缓存
									this.$queue.setData('addressStorage', this.beforePageData)
								}else{ //初始页面，先检查缓存，再判断是否使用第一个地址
									if (this.$queue.getData('addressStorage')) { //判断本地是否有缓存上次使用的地址
										this.beforePageData = this.$queue.getData('addressStorage')
										if (this.beforePageData) { //缓存本次使用的地址数据用于下次使用
											this.$queue.setData('addressStorage', this.beforePageData)
										} else {
											let array = []
											this.addressList.map((item, index) => {
												if (item.is_first == 1) {
													array = array.push(item)
												}
											})
											console.log(array);
											if (array.length > 0) {
												this.beforePageData = array[0]
											} else {
												this.beforePageData = this.addressList[0]
											}
											this.$queue.setData('addressStorage', this.beforePageData)
										}
									} else {
										this.beforePageData = this.addressList[0]
										this.$queue.setData('addressStorage', this.beforePageData)
									}
								}
								console.log(this.beforePageData);
							// }else{
							// 	this.addressList =[]
							// }
						}else{
							this.addressList =[]
						}
					})
			},
			selectItem(c_index) {
				this.urgentdata.child.map((item, i) => {
					item.select = i == c_index ? true : false
					this.urgent = item.select ? item.label_classify : 2 //正常回收：2；加急回收：1；
				})
				console.log(this.urgent);
				this.$forceUpdate()
			},
			checkedRequired(c_item){
				c_item.checked = !c_item.checked
				this.$forceUpdate()
			},
			navTo(url) {
				if(!this.$queue.getData('isLogin')){
					this.$queue.navTo('/pages/public/login')
					return;
				}
				this.$queue.navTo(url)
			},
			navBack() { //返回
				uni.navigateBack({})
			},
			keep() { //提交
				if(!this.$queue.getData('isLogin')){
					this.$queue.navTo('/pages/public/login')
					return;
				}
				let demand = '' //要求
				let urgent = this.urgent//加急
				//数组转字符串开始
				let array = []
					this.requiredata.child.map((c_item, c_index) => {
						if (c_item.checked) {
							array.push(c_item.label)
						}
					})
					demand = array.toString()
				//数组转字符串结束
				// let newdamand = array.length <=0 ? '无':demand 
				let temp1 = [
					{
						goods_classify: this.$queue.getData('goods_classify'),
						goods_sub_labels:this.$queue.getData('goods_sub_labels'),
						location: this.beforePageData.city +  this.beforePageData.district
					}
				]
					console.log(temp1);
				let temp2 = []
				if(this.$queue.getData('cartData')){ //回收车缓存的订单参数
					let cartData = this.$queue.getData('cartData')
						cartData.map((item,index)=>{
							item.location = this.beforePageData.city +  this.beforePageData.district
						})
						temp2 = cartData
						console.log(temp2);
				}
				let temp3 = []
				if(this.$queue.getData('re_orderData')){ //重新下单缓存的数据
					let orderData = this.$queue.getData('re_orderData')
						orderData.map((item,index)=>{
							item.location = this.beforePageData.city +  this.beforePageData.district
						})
					temp3 = orderData
					console.log(orderData);
				}
				
				let temp = this.prepages === '1'? temp2 :this.prepages === '3'? temp3: temp1  // ==='1' 回收车创建订单  ==='3'为重新下单  '2'并未使用  else为预约回收创建订单
				console.log(temp);
				let data = {
					action: 'add',
					mode: 'addOrder',
					user: 'common',
					address: this.beforePageData.address,
					location: this.beforePageData.city +  this.beforePageData.district,
					n:this.$queue.getData('n'),
					name: this.beforePageData.name,
					order_describe: demand,
					order_urgent: urgent,
					phone_key: this.$queue.getData('clientId'),
					phone_no:this.beforePageData.phone_no,
					order_goods:temp
				}
					console.log(data);
					// return;
				this.$zshs.request('/web/users/orders', data, 'POST')
					.then((res) => {
						console.log(res);
						if(res.code === 200){
							if(res.data.code === 0){
								if(this.prepages === '1'){  //如果是回收车创建订单，创建成功后需要删除购物车  ----天才后台的脑路
									this.$zshs.request('/web/users/recovery-classify',{
										mode:'delOrderRecyclingCart',
										user:'common',
										n:this.$queue.getData('n'),
										del_ids:JSON.stringify(this.$queue.getData('delectId'))      //后台需要数组转JSON字符串
									},'POST')
									.then((ress)=>{
										console.log(ress);
										if(res.code == 200){
											if(res.data.code ===0){
												uni.redirectTo({
													url:'/pages/createdOrder/appointSuccess?orderId=' + res.data.o_id //提交成功后跳转
												})
											}
										}
									})
									
								}else{
									uni.redirectTo({
										url:'/pages/createdOrder/appointSuccess?orderId=' + res.data.o_id//提交成功后跳转
									})
								}
							}
						}else{
							this.$queue.showToast('请求失败')
						}
						
					})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100vw;
		// height: calc(100vh- 44px);
		overflow: hidden;
		padding: 0 64rpx;
	}

	.back-btn {
		position: absolute;
		top: 32rpx;
		left: 48rpx;
		/*#ifdef APP-PLUS*/
		top: 76rpx;
		/*#endif*/
		width: 50rpx;
		height: 50rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.appoint-view {
		display: flex;
		flex-direction: column;
		margin-top: 168rpx;
		margin-bottom: 72rpx;

		.appoint-text {
			font-family: PingFangSC-Semibold;
			font-size: 48rpx;
			color: #3D3D3D;
			font-weight: 600;

		}

		.tips {
			font-size: 24rpx;
			color: #999999;
			font-weight: 400;
		}
	}

	.parameter-view {
		width: 100%;

		.parameter-item {
			margin-bottom: 40rpx;

			.parameter-name {
				font-size: 28rpx;
				color: #3D3D3D;
				font-weight: bold;
				margin-bottom: 32rpx;
			}

			.parameter-child {
				display: flex;
				flex-wrap: wrap;

				.child-item {
					height: 64rpx;
					white-space: nowrap;
					padding: 14rpx 16rpx;
					border: 2rpx solid #cfcfcf;
					border-radius: 4rpx;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					margin-right: 24rpx;
					margin-bottom: 24rpx;
				}

				.active {
					color: #F7A300;
					border: 1rpx solid #F7A300 !important;
				}
			}
		}
	}

	.next-btn {
		width: 100vw;
		height: 98rpx;
		background: #FFD426;
		font-size: 32rpx;
		color: #3D3D3D;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		left: 0;
		bottom: 0;

		.next-text {
			font-size: 32rpx;
			color: #3D3D3D;
			font-weight: bold;
		}
	}

	.address-view {
		width: 100%;

		.address-text {
			font-size: 28rpx;
			color: #3D3D3D;
			font-weight: bold;
			margin-bottom: 32rpx;
		}

		.add-address {
			width: 100%;
			height: 156rpx;
			border: 2rpx solid #F5F5F5;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 48rpx;
				height: 48rpx;
			}
		}

		.address-detail {
			padding: 24rpx 28rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border: 2rpx solid #F5F5F5;
			border-radius: 8rpx;

			.address-box {
				display: flex;
				flex-direction: column;
				justify-content: center;

				.person {
					font-size: 28rpx;
					color: #3D3D3D;
					line-height: 40rpx;
					font-weight: 600;
				}

				.address-text {
					font-size: 24rpx;
					color: #646464;
					line-height: 34rpx;
					font-weight: 400;
				}
			}

			.alter {
				padding: 24rpx;
				white-space: nowrap;
				font-size: 28rpx;
				color: #F7A300;
				font-weight: 400;
			}
		}
	}
	.guide {
		position: fixed;
		top: 200rpx;
		left: 200rpx;
		right: 0;
		bottom: 0px;
		z-index: 1000;
		.skip{
			width: 120rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 30rpx;
			background-color: #666;
			color: #FFFFFF;
			font-size: 34rpx;
			font-weight: 700;
			position: absolute;
			top: -100rpx;
			right: 40rpx;
			z-index: 110;
		}
		.guide-box {
			position: fixed;
			z-index: 100;
			// transition: all 0.2s;
			border-radius: 10rpx;
			.arrow {
				height: 20rpx;
				width: 0rpx;
				background: #F7A300;
				position: absolute;
				top: 144rpx;
				left: 50%;
				transform: rotate(45deg);
			}
	
			.tips {
				background: #F7A300;
				box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.1);
				color: #fff;
				position: absolute;
				top: 270rpx;
				left: -50%;
				padding: 15rpx 20rpx;
				font-size: 30rpx;
				border-radius: 12rpx;
	
				.text {
					white-space: nowrap;
				}
	
				.next {
					// width: 100%;
					text-align: right;
					padding-right: 0rpx;
					margin-top: 10rpx;
					font-size: 32rpx;
					vertical-align: center;
					.readagain{
						font-size:28rpx;
						margin-right: 140rpx;
					}
				}
			}
		}
	}
</style>
