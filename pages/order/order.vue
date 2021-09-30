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
				<view class="middle">{{title}}</view>
				<view class="right" @click="showPicker()">
					<image src="../../static/order/shaixuan.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view class="order-view">
			<view class="order-item" v-if="orderList.length > 0" v-for="(item,index) in orderList" :key="index"
				@click="navTo('/pages/order/orderDetail?orderId=' + item.o_id)">
				<view class="order-state">
					<view class="state-left" v-if="item.order_status == 1">
						<view class="point"></view>
						<view class="state-text">派单中</view>
					</view>
					<view class="state-left" v-if="item.order_status == 2">
						<view class="point"></view>
						<view class="state-text">待预约</view>
					</view>
					<view class="state-left" v-if="item.order_status == 3">
						<view class="point y-bgc"></view>
						<view class="state-text y-tc">待回收(2021年8月3日 18:00~19:00)</view>
					</view>
					<view class="state-left" v-if="item.order_status == 4">
						<view class="point g-bgc"></view>
						<view class="state-text g-tc">已完成</view>
					</view>
					<view class="state-left" v-if="item.order_status == 5 || item.order_status == 6">
						<view class="point bl-bgc"></view>
						<view class="state-text bl-tc">已取消</view>
					</view>

					<view class="state-right" v-if="item.order_urgent == 1">急</view>
				</view>
				<view class="order-detail">
					<view class="detail-item">
						<view class="detail-left">回收物品</view>
						<view class="detail-right">{{item.typeList}}</view>
					</view>
					<view class="detail-item">
						<view class="detail-left">联系电话</view>
						<view class="detail-right">{{item.name + '('+ item.phone_no + ')'}}</view>
					</view>
					<view class="detail-item">
						<view class="detail-left">联系地址</view>
						<view class="detail-right">{{item.location + item.address}}</view>
					</view>
				</view>
				<view class="btn-view">
					<view class="order-btn m-color" v-if="item.order_status == 6"
						@click.stop="navTo('/pages/order/comment')">
						评价
					</view>
					<view class="order-btn" @click.stop="orderAgain(item)" v-if="item.order_status == 5">
						重新下单
					</view>
					<view class="order-btn" @click.stop="takePhone(item.business_phone_no)"
						v-if="item.business_phone_no">
						联系回收商
					</view>
					<view class="order-btn"
						v-if="item.order_status == 1 || item.order_status == 2 ||item.order_status == 3"
						@click.stop="cancleOrder(item.o_id)">
						取消订单
					</view>
				</view>
			</view>
			<view class="empty-view" v-if="IsEmpty">
				<view class="imgbox">
					<image class="emptyImg" src="../../static/order/empty.png" mode="aspectFill"></image>
				</view>
				<view class="empty-text">
					空空如也~
				</view>
			</view>
		</view>
		<view class="modal-view">
			<u-modal v-model="showmodal" :show-title="showTitle" :title="modalTitle" :title-style="titleStyle"
				:confirm-text="confirmText" :show-cancel-button="true" :content="content" @confirm="comfirm"
				:confirm-color="confirmColor">
			</u-modal>
		</view>
		<view class="picker">
			<u-picker mode="selector" :default-selector="[chooseItem]" v-model="show" :range="selector"
				cancel-color="#999999" @confirm="selectState" confirm-color="#F7A300"></u-picker>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '我的订单',
				chooseItem: 0, //选择器默认选中
				show: false, //选择器显示隐藏 
				state: 0, // 订单状态 0：全部  1：派单中 2：待预约  3：待回收 4：已完成 5：已取消 6：已过期
				selector: ['全部', '派单中', '待预约', '待回收', '已完成', '已取消', '已过期'],
				orderList: [],
				o_length: 0,
				pageIndex: 1,
				pageSize: 10,
				allTotal: 0,

				showmodal: false,
				showTitle: true,
				modalTitle: '立即联系回收商',
				titleStyle: {
					color: '#3d3d3d'
				},
				content: '',
				confirmText: '拨打电话',
				modalType: 0, //0为联系电话  1为取消订单
				confirmColor: '#F7A300',
				phoneNumber: '', //回收商电话
				cancel_id: 0 ,//需要取消的订单id
				IsEmpty:false
			}
		},
		onLoad(options) {
			console.log(options);
			if(options.state){
				this.state = options.state
				this.chooseItem = parseInt(options.state)
				this.title = this.state == 1 ? '派单中' : this.state == 2 ? '待预约' : this.state == 4 ? '已完成' :'我的订单'
			}
			this.getOrderLists()
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			if (this.o_length < this.allTotal) {
				this.pageIndex++;
				this.getOrderLists() //请求更多数据列表
			} else {
				this.$queue.showToast('已加载全部数据')
				// console.log('已加载全部数据')
			}
		},
		onPullDownRefresh() {
			this.pageIndex = 1
			this.orderList = []
			this.getOrderLists()
		},
		methods: {
			selectState(e) {
				console.log(e);
				this.state = e[0]
				this.chooseItem = e[0]
				if (e[0] === 0) {
					this.title = '我的订单'
				} else {
					this.title = this.selector[e[0]]
				}
				this.pageIndex = 1
				this.orderList = []
				this.getOrderLists()
			},
			comfirm() {
				uni.makePhoneCall({
					phoneNumber: this.phoneNumber,
					success: (res) => {
						console.log('调用成功!', res)
					},
					fail: (res) => {
						console.log('调用失败!', res)
					}
				})
			},
			getOrderLists() {
				let n_id = this.$queue.getData('n')
				let p_key = this.$queue.getData('clientId')
				this.$zshs.request('/web/users/orders?page=' + this.pageIndex + '&per-page=' + this.pageSize, {
						action: "all",
						mode: "getOrders",
						n: n_id,
						order_status: this.state,
						phone_key: p_key,
						user: "common"
					}, 'POST')
					.then((res) => {
						console.log(res);
						if (res.code == 200) {
							if (res.data.code === 0) {
								uni.stopPullDownRefresh();
								uni.hideLoading()
								this.allTotal = res.data.count
								this.IsEmpty = res.data.orders.length > 0 ? false : true
								let datalist = []
								datalist = res.data.orders
								datalist.map((item, index) => {
									let child = item.order_goods
									let typelist = ''
									child.map((c_item, c_index) => {
										var str1 = c_item.goods_sub_labels.split(';');
										var str2 = str1[0].split(':')
										c_item.type = str2[1]
										typelist += (c_item.type + '、')
									})
									typelist = typelist.substr(0, typelist.length - 1);
									item.typeList = typelist
									let t_create = this.$manba().time(item.created_at + '000').format('f')
									item.createdTime = t_create

								})
								this.orderList = this.orderList.concat(datalist)
								this.o_length = this.orderList.length //申明一个变量 o_length避免刷新页面是数组清空触底加载多次
								// console.log(this.orderList);
							}
						}
					})
			},
			orderAgain(item){
				console.log(item);
				let temp = item.order_goods
				this.$queue.setData('re_orderData',temp)
				console.log(temp);
				let data={
					urgent:item.order_urgent,
					order_describe:item.order_describe
				}
				uni.navigateTo({
					url:'/pages/createdOrder/appointment?re_orderdata=' + JSON.stringify(data)
				})
			},
			takePhone(number) {
				console.log(number);
				this.showmodal = true
				this.modalType = 0
				this.phoneNumber = number
				this.content = 'Tel:' + number
				this.modalTitle = '立即联系回收商'
				this.confirmText = '拨打电话'
			},
			cancleOrder(o_id) {
				console.log(o_id);
				uni.navigateTo({
					url: '/pages/order/cancelOrder?o_id=' + o_id
				})
			},
			showPicker() {
				this.show = true
			},
			navTo(url) {
				this.$queue.navTo(url)
			},
			back() {
				uni.switchTab({
					url: '/pages/user/user'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100vw;
		// height: calc(100vh - 88rpx);
		background-color: #F5F5F5;
	}

	.title-bar {
		position: fixed;
		top: 0;
		left: 0;
	}

	.empty {
		width: 100vw;
		height: 60rpx;
		background-color: #FFFFFF;
	}

	.title-view {
		width: 100vw;
		height: 88rpx;
		background: #FFFFFF;
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

	.order-view {
		width: 100vw;
		min-height: 100vh;
		// overflow-y: scroll;
		padding: 0 16rpx;
		margin-top: 88rpx;
		overflow: hidden;
		/*#ifdef APP-PLUS*/
		margin-top: 148rpx;
		/*#endif*/

		.order-item {
			width: 100%;
			min-height: 388rpx;
			background-color: #FFFFFF;
			padding: 32rpx;
			margin: 32rpx 0;
			border-radius: 24rpx;

			.order-state {
				display: flex;
				justify-content: space-between;
				padding-bottom: 24rpx;

				.state-left {
					display: flex;
					align-items: center;

					.point {
						width: 16rpx;
						height: 16rpx;
						border-radius: 16rpx;
						background: #3693F6;
						margin-right: 16rpx;
					}

					.state-text {
						font-size: 28rpx;
						color: #3693F6;
						font-weight: bold;
					}

					.y-bgc {
						background: #F7A300;
					}

					.y-tc {
						color: #F7A300;
					}

					.g-bgc {
						background: #2AC89B;
					}

					.g-tc {
						color: #2AC89B;
					}

					.bl-bgc {
						background-color: #646464;
					}

					.bl-tc {
						color: #646464;
					}
				}

				.state-right {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 40rpx;
					height: 36rpx;
					background-color: #F76675;
					border-radius: 8rpx;
					font-size: 24rpx;
					color: #FFFFFF;
					line-height: 32rpx;
					font-weight: 400;
				}
			}

			.order-detail {
				border-top: 2rpx solid #f5f5f5;
				border-bottom: 2rpx solid #f5f5f5;
				padding: 24rpx;

				.detail-item {
					display: flex;
					font-size: 24rpx;
					color: #646464;
					line-height: 40rpx;
					font-weight: 400;

					.detail-left {
						white-space: nowrap;
						margin-right: 32rpx;
					}

					.detail-right {}
				}
			}
		}
		.empty-view{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 100%;
			height:100vh;
			.imgbox{
				width: 300rpx;
				height: 400rpx;
				.emptyImg{
					width: 100%;
					height: 100%;
				}
			}
			.empty-text{
				margin-top: 10rpx;
				color: #d9dbdd;
			}
		}
	}

	.btn-view {
		display: flex;
		justify-content: flex-end;

		.order-btn {
			border: 2rpx solid #646464;
			color: #646464;
			border-radius: 8rpx;
			padding: 10rpx;
			margin-top: 24rpx;
			margin-left: 24rpx;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.m-color {
			border: 2rpx solid #F7A300;
			color: #F7A300;
			border-radius: 8rpx;
		}
	}
</style>
