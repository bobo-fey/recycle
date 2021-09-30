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
				<view class="middle">我的订单</view>
				<view class="right" @click="takePhone('(0759)3325722')">
					<image src="../../static/order/kefu.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view class="bg-view"></view>
		<view class="state-view">
			<view class="ji" v-if="orderData.order_urgent == 1">
				急
			</view>
			<view class="order-state">
				{{status}}
			</view>
			<view class="order-tips">
				<view class="tips-item" v-if="orderData.order_status == '1'">
					系统正在为您安排回收商，请稍后…
				</view>
				<view class="tips-item"
					v-if="orderData.order_status == '2' || orderData.order_status == '3' ||orderData.order_status == '4'">
					<text>预定</text>
					<text style="color:#f7a300">{{appoint_time+'~'+out_time}}</text>
					<text>上门服务</text>
				</view>
				<view class="tips-item" v-if="orderData.order_status == '5'">
					已与回收商达成协议，取消订单
				</view>
				<view class="tips-item" v-if="orderData.order_status == '6'">
					订单已过去，请重新下单
				</view>
			</view>
			<view class="btn-view">
				<view class="btn-item mr"
					v-if="orderData.order_status == '1' ||orderData.order_status == '2' ||orderData.order_status == '3'"
					@click="navTo('/pages/order/cancelOrder?o_id='+ orderData.o_id)">
					取消订单
				</view>
				<view class="btn-item" v-if="orderData.order_status == '3' && isTimeout" @click="navTo()">
					确认回收
				</view>
			</view>
		</view>
		<view class="mian-view">
			<view class="merchants" v-if="workman || business">
				<view class="merchant-text">
					回收商
				</view>
				<view class="merchant-list">
					<view class="merchant-item" v-if="workman">
						<view class="merchant-left">
							<view class="merchant-img">
								<image :src="workman.user_img"></image>
							</view>
							<view class="merchant-info">
								<view class="info-top">
									<text style="margin-right: 20rpx;">{{workman.user_name}}</text>
									<text>{{workman.user_title}}</text>

								</view>
								<view class="info-bot">
									<view class="info-phone">
										TEL：{{workman.phone_no}}
									</view>
									<view class="info-address">
										NO.{{workman.user_no}}
									</view>
								</view>
							</view>
						</view>
						<view class="merchant-right" @click="takePhone(workman.phone_no)">
							<image src="../../static/order/phone.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="merchant-item" v-if="business">
						<view class="merchant-left">
							<view class="merchant-img">
								<image :src="business.logo_img" mode="aspectFill"></image>
							</view>
							<view class="merchant-info">
								<view class="info-top">
									<text style="margin-right: 20rpx;">{{business.shop_name}}</text>
								</view>
								<view class="info-bot">
									<view class="info-phone">
										TEL：{{business.phone_no}}
									</view>
									<view class="info-address">
										{{business.address}}
									</view>
								</view>
							</view>
						</view>
						<view class="merchant-right" @click="takePhone(business.phone_no)">
							<image src="../../static/order/phone.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="re-box">
				<view class="re-text" v-if="orderData.order_goods">
					回收清单
					{{orderData.order_goods.length}}
				</view>
				<view class="re-list" v-if="orderData.order_goods">
					<view class="re-item" v-for="(item,index) in orderData.order_goods" :key="index">
						<view class="re-img">
							<image src="../../static/cart/kongtiao.png" mode="aspectFill"></image>
						</view>
						<view class="re-detail">
							<view class="re-name">
								{{item.goods_classify + '/' +item.type}}
							</view>
							<view class="re-desc">
								{{item.goods_sub_labels}}
							</view>
						</view>
					</view>
				</view>
				<view class="demand-text" v-if="describe">
					服务需求
				</view>
				<view class="demand-type" v-if="describe" >
					<view class="demand-item" v-for="(item,index) in orderData.order_describe" :key="index">
						{{item}}
					</view>
				</view>
			</view>

			<view class="re-address">
				<view class="address-text">
					回收地址
				</view>
				<view class="concat">
					<view class="concat-type">
						<view class="number">
						{{orderData.name+'('+ orderData.phone_no + ')'}}
						</view>
						<view class="address">
							{{orderData.location + orderData.address}}{{orderData.phone_no}}
						</view>
					</view>
					<view class="phone-img"  @click="takePhone(orderData.phone_no)">
						<image src="../../static/order/phone.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>

			<view class="order-info">
				<view class="info-text">
					订单信息
				</view>
				<view class="info-item">
					<view class="info-left">
						订单编号
					</view>
					<view class="info-right">
						{{orderData.no}}
					</view>
				</view>
				<view class="info-item">
					<view class="info-left">
						下单时间
					</view>
					<view class="info-right">
						{{created_time}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: '',
				order_id: '',
				orderData: {},
				business: null,
				workman: null,
				created_time:'', //下单时间
				appoint_time: '', //预约时间
				out_time: '', //超时时间
				isTimeout: false, //是否超时
				describe:true,
			}
		},
		onLoad(options) {
			if (options.orderId) {
				this.order_id = options.orderId
				this.getOrderDetail()
			}
		},
		methods: {
			getOrderDetail() {
				let n_id = this.$queue.getData('n')
				let p_key = this.$queue.getData('clientId')
				this.$zshs.request('/web/users/orders', {
						action: "one",
						mode: "getOrders",
						n: n_id,
						o_id: this.order_id,
						phone_key: p_key,
						user: "common"
					}, 'POST')
					.then((res) => {
						console.log(res);
						if (res.code === 200) {
							if (res.data.code == 0) {
								this.orderData = res.data.orders
								let datalist = this.orderData.order_goods
								// 回收类型数据处理开始
								datalist.map((item, index) => {
									var str1 = item.goods_sub_labels.split(';');
									var str2 = str1[0].split(':')
									item.type = str2[1]
								})
								// 回收类型数据处理开始

								// 使用情况数据处理开始
								let array = ''
								datalist.map((item, index) => {
									var str = item.goods_sub_labels.split(';');
									let str4 = ''
									let newlist = []
									let newString = ''
									str.map((s_item, s_index) => {
										var str3 = s_item.split(':')
										str4 += str3 + ','
										array = str4.substr(0, str4.length - 1).split(',')
										array.map((item, index) => {
											if (index % 2 !== 0) {
												newlist.push(item)
											}
										})
										newlist = newlist.slice(1) //移除数组第一个元素
										// console.log(newlist); //["美的"] 
										newlist.map((item, index) => {
											newString = item + ';'
										})
										newString = newString.substr(0, newString.length -1) //去掉最后一项的';'
										// console.log(newString);  //美的
										item.labels = newString
									})
								})
								// console.log(array); //["类型", "滚筒洗衣机", "品牌", "美的"]
								// 使用情况数据处理结束
								console.log(this.orderData, '最终'); //最终得到的数据结构
								let describeLength = this.orderData.order_describe.length //订单数组的长度
								this.describe = describeLength > 0 ? describeLength == 1 ? this.orderData.order_describe[0] == '' ? false : true :true : false
								
								this.business = this.orderData.business
								this.workman = this.orderData.workman
								this.status = this.orderData.order_status == '1' ? '派单中' : this.orderData
									.order_status == '2' ? '待预约' : this.orderData.order_status == '3' ? '待回收' : this
									.orderData.order_status == '4' ? '已完成' : this.orderData.order_status == '5' ? this
									.orderData.order_status == '5' ? '已取消' : this.orderData.order_status == '6' ?
									'已过期' : '' : ''

								//格式化后台返回的时间戳 数据处理开始
								let original_time = this.$manba().time(this.orderData.appoint_at + '000').format('kk') //格式：年月日十分秒
								let monthday = original_time.split('年')[1].split(' ')[0] //月日
								let original_time2 = this.$manba().time(this.orderData.appoint_at + '000').format('f') //格式：2021-07-23 01:41:00
								let hours = original_time2.split(' ')[1].split(':')[0] //01
								let minute = original_time2.split(' ')[1].split(':')[1] // 41
								let twohours = parseInt(this.orderData.appoint_at + '000') + 7200000 //超时时间戳(+2小时)
								let outtime = this.$manba().time(twohours).format('f') //2021-07-23 03:41:00
								this.appoint_time = monthday + ' ' + hours + ':' + minute //07月23日 01:41
								this.out_time = outtime.split(' ')[1].split(':')[0] + ':' + outtime.split(' ')[1].split(':')[1] //03:41 
								this.created_time =  this.$manba().time(this.orderData.created_at + '000').format('f')
								//数据处理结束

								let timestamp = Date.parse(new Date()); //当前时间戳
								if (twohours < timestamp) { //订单超时显示确认回收按钮
									this.isTimeout = true
								}
							}
						}
					})
			},
			takePhone(number) {
				uni.makePhoneCall({
					phoneNumber: number,
					success: (res) => {
						console.log('调用成功!', res)
					},
					fail: (res) => {
						console.log('调用失败!', res)
						// this.takePhone(number);//重复调用一次
					}
				});
			},
			navTo(url) {
				this.$queue.navTo(url)
			},
			back() {
				uni.navigateBack({})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100vw;
		min-height: 100vh;
		background-color: #F5F5F5;
	}

	.title-bar {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
	}

	.empty {
		width: 100vw;
		height: 60rpx;
		background-color: #FFD426;
	}

	.title-view {
		width: 100vw;
		height: 88rpx;
		background: #FFD426;
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

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.bg-view {

		width: 100vw;
		height: 172rpx;
		/*#ifdef APP-PLUS*/
		height: 232rpx;
		/*#endif*/
		background-color: #FFD426;
	}

	.state-view {
		width: 718rpx;
		height: 266rpx;
		background-color: #FFFFFF;
		border-radius: 24rpx;
		padding: 32rpx;
		position: absolute;
		top: 100rpx;
		/*#ifdef APP-PLUS*/
		top: 160rpx;
		/*#endif*/
		left: 16rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.ji {
			width: 54rpx;
			height: 64rpx;
			color: #FFFFFF;
			background-color: #F76675;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: 0;
			left: 32rpx;
		}

		.order-state {
			font-size: 40rpx;
			color: #3D3D3D;
			font-weight: 600;
			margin-bottom: 16rpx;
		}

		.order-tips {
			font-size: 24rpx;
			color: #999999;
			text-align: center;
			font-weight: 400;
			margin-bottom: 32rpx;
		}

		.btn-view {
			display: flex;

			.btn-item {
				padding: 12rpx 42rpx;
				background: #FFFFFF;
				border: 1px solid #F7A300;
				border-radius: 16px;
				color: #F7A300;
			}

			.mr {
				margin-right: 32rpx;
			}
		}
	}

	.mian-view {
		width: 100vw;
		margin-top: 230rpx;
		padding: 0 16rpx;
		overflow: hidden;

		.merchants {
			width: 100%;
			padding: 32rpx;
			background-color: #FFFFFF;
			border-radius: 24rpx;
			margin-bottom: 32rpx;

			.merchant-text {
				font-size: 32rpx;
				color: #3D3D3D;
				font-weight: bold;
				padding-bottom: 24rpx;
			}

			.merchant-list {
				width: 100%;

				// display: flex;
				// flex-direction: colum;
				// align-items: center;
				.merchant-item {
					border-top: 2rpx solid #f4f4f4;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-top: 32rpx;
					padding-bottom: 26rpx;

					// margin-top: 60rpx;
					.merchant-left {
						display: flex;
						align-items: center;

						.merchant-img {
							width: 96rpx;
							height: 96rpx;
							border-radius: 48rpx;
							overflow: hidden;
							margin-right: 32rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.merchant-info {
							width: 400rpx;
							display: flex;
							flex-direction: column;
							justify-content: center;

							.info-top {
								font-size: 28rpx;
								color: #3D3D3D;
								font-weight: bold;
							}

							.info-bot {
								font-size: 24rpx;
								color: #999999;
								font-weight: 400;

								.info-phone {}

								.info-address {}
							}
						}
					}

					.merchant-right {
						width: 64rpx;
						height: 64rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}

		.re-box {
			background: #FFFFFF;
			border-radius: 24rpx;
			padding: 32rpx;
			margin-bottom: 32rpx;

			.re-text {
				font-size: 32rpx;
				color: #3D3D3D;
				font-weight: bold;
				margin-bottom: 24rpx;
			}

			.re-list {
				width: 100%;
				padding: 32rpx 0;
				border-top: 2rpx solid #f4f4f4;
				border-bottom: 2rpx solid #f4f4f4;
				margin-bottom: 32rpx;
				overflow: hidden;

				:last-child {
					margin-bottom: 0 !important;
				}

				.re-item {
					display: flex;
					align-items: center;
					margin-bottom: 32rpx;

					.re-img {
						width: 96rpx;
						height: 96rpx;
						background: #F5F5F5;
						border: 2rpx solid #3D3D3D;
						border-radius: 8rpx;
						margin-right: 32rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.re-detail {
						width: 500rpx;
						display: flex;
						flex-direction: column;

						.re-name {
							font-size: 28rpx;
							color: #3D3D3D;
							font-weight: 500;
							margin-bottom: 8rpx;
						}

						.re-desc {

							font-size: 24rpx;
							color: #999999;
							font-weight: 400;
						}
					}
				}
			}

			.demand-text {
				font-size: 32rpx;
				color: #3D3D3D;
				font-weight: bold;
				margin-bottom: 32rpx;
			}

			.demand-type {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				flex-wrap: wrap;

				.demand-item {
					padding: 8rpx 16rpx;
					border: 2rpx solid #999999;
					border-radius: 8rpx;
					font-size: 28rpx;
					color: #999999;
					font-weight: 400;
					margin-right: 28rpx;
					margin-bottom: 20rpx;

				}
			}
		}

		.re-address {
			border-radius: 24rpx;
			background-color: #FFFFFF;
			padding: 32rpx;
			margin-bottom: 32rpx;

			.address-text {
				font-size: 32rpx;
				color: #3D3D3D;
				font-weight: bold;
				padding-bottom: 24rpx;
				border-bottom: 2rpx solid #f4f4f4;
				margin-bottom: 12rpx;
			}

			.concat {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.concat-type {
					width: 360rpx;

					.number {
						font-size: 28rpx;
						color: #3D3D3D;
						line-height: 48rpx;
						font-weight: bold;
					}

					.address {
						font-size: 24rpx;
						color: #646464;
						line-height: 48rpx;
						font-weight: 400;
					}
				}

				.phone-img {
					width: 64rpx;
					height: 64rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.order-info {
			border-radius: 24rpx;
			background-color: #FFFFFF;
			padding: 32rpx;
			margin-bottom: 20rpx;

			.info-text {
				font-size: 32rpx;
				color: #3D3D3D;
				font-weight: bold;
				margin-bottom: 26rpx;
			}

			.info-item {
				border-top: 2rpx solid #f4f4f4;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.info-left {
					font-size: 28rpx;
					color: #3D3D3D;
					font-weight: 400;
				}

				.info-right {
					font-size: 28rpx;
					color: #999999;
					text-align: right;
					line-height: 88rpx;
					font-weight: 400;
				}
			}
		}
	}
</style>
