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
				<view class="middle">地址管理</view>
				<view class="right" @click="navTo('/pages/address/addressEdit')">
					<image src="../../static/address/y-addbtn.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view class="address-list">
			<u-swipe-action :disabled="disabled" :show="item.show" :index="index" v-for="(item, index) in addressList"
				:key="item.id" @click="EditOrDelect" @open="open" :options="options">
				<view class="address-item">
					
						<view class="address-left">
							<view class="radio-view" v-if="pageFrom == '1'">
								<u-radio-group v-model="value" @change="radioGroupChange">
								<u-radio @change="radioChange" :name="item.id" active-color="#F7A300">
									<!-- u-radio-group的v-model绑定的值如果设置为某个radio的id，就会被默认选中 -->
								</u-radio>
								</u-radio-group>
							</view>
							<view class="address-detail" @click.stop="chooseAddress(item.id)">
								<view class="person-Info">
									<view class="person-text" v-if="item.phone_no">
										{{item.name + `(`+ item.phone_no +`)`}}
									</view>
									<view class="default" v-if="item.is_first === 1">
										默认
									</view>
								</view>
								<view class="address-text">
									{{item.province + item.city + item.district +item.address }}
								</view>
							</view>
						</view>
					
					<view class="address-right">
						<view class="right-img">
							<image src="../../static/user/right.png" mode="aspectFill"></image>
						</view>
					</view>
					
				</view>
			</u-swipe-action>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageFrom: '',
				disabled: false,
				show: false,
				value: 0,
				a_id:'',
				addressList: [],
				// list: [{
				// 		id: 0,
				// 		show: false
				// 	},
				// 	{
				// 		id: 1,
				// 		show: false
				// 	},
				// 	{
				// 		id: 2,
				// 		show: false,
				// 	}
				// ],
				options: [{
						text: '编辑',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]
			}
		},
		onLoad(options) {
			if (options.pagesfrom) {
				// this.pageFrom = this.$zshs.getDAes(options.pagesfrom)
				this.pageFrom = options.pagesfrom
				this.disabled = this.pageFrom == '1' ? true : false
			}
			if(options.a_id){
				this.a_id = options.a_id
			}
		},
		onShow() {
			this.getAddressList()
		},
		methods: {
			getAddressList() {
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
						this.addressList = res.data
						this.addressList.map((item, index) => {
							item.show = false
							if(this.a_id){  //从预约服务页面跳转，选择地址，设置勾选为当前选中
								this.value = this.a_id
							}else{
								if (item.is_first === 1) {
									this.value = item.id //设置默认地址被勾选
								}
							}
						})
						console.log(this.addressList);
					})
			},
			radioGroupChange(e) {
				console.log(e);
				let temp = {}
				this.addressList.forEach((item)=>{
					if(item.id == e){
						temp = { //需要返回上一个页面的参数
							name: item.name,
							phone_no: item.phone_no,
							province: item.province,
							city: item.city,
							district: item.district,
							address: item.address,
							id:item.id
						}
					}
				})
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				prevPage.$vm.beforePageData = temp; //修改上一页data里面的参数值为
				prevPage.$vm.dataChange = true;//修改上一页data里面的dataChange参数值为true
				uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
					delta: 1,
				})
			},
			radioChange(e) {
				console.log(e);
				
			},
			chooseAddress(id) {
				if (this.pageFrom == '1') { // 创建订单预约服务选择地址才触发跳转
					// console.log(`选了id为${id}的地址`);
					this.value = id //更改radio选中的value
					let temp = {}
					this.addressList.forEach((item)=>{
						if(item.id == id){
							temp = { //需要返回上一个页面的参数
								name: item.name,
								phone_no: item.phone_no,
								province: item.province,
								city: item.city,
								district: item.district,
								address: item.address,
								id:item.id
							}
						}
					})
					let pages = getCurrentPages(); //获取所有页面栈实例列表
					let nowPage = pages[pages.length - 1]; //当前页页面实例
					let prevPage = pages[pages.length - 2]; //上一页页面实例
					prevPage.$vm.beforePageData = temp; //修改上一页data里面的地址数据
					prevPage.$vm.dataChange = true;//修改上一页data里面的dataChange参数值为true
					uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
						delta: 1,
					})
				}
			},
			EditOrDelect(index, index1) {
				console.log(index,index1);
				let a_id = this.addressList[index].id
				let c_key = this.$queue.getData('clientId')
				let n_id = this.$queue.getData('n')
				if (index1 == 1) {  //删除操作
					// this.$u.toast(`删除了第${index}个cell`);
					this.$zshs.request('/web/users/account', {
						action: "del",
						address_id:a_id,
						mode: "setAddress",
						n:n_id,
						phone_key: c_key,
						user: "common"
					}, 'POST')
						.then((res)=>{
							console.log(res);
							this.addressList.splice(index, 1);
							uni.removeStorageSync('addressStorage');
						})
				} else { //编辑操作
					this.addressList[index].show = false;
					
					// let a_id = this.$zshs.getAES(id.toString())  //c_type字段控制只有编辑地址时才出现删除按钮
					
					this.$queue.navTo('/pages/address/addressEdit?a_id=' + a_id)
				}
			},
			open(index) {
				console.log(index);
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.addressList[index].show = true;
				this.addressList.map((val, idx) => {
					if (index != idx) this.addressList[idx].show = false;
				})
				this.$forceUpdate();
			},
			navTo(url) {
				this.$queue.navTo(url)
			},
			back() {
				uni.navigateBack({})
			},
			showPicker() {
				this.isShow = true
			},
			confirm(e) {
				console.log(e);
				this.reason = e[0].label
				console.log(this.reason);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100vw;
		height: 100vh;
		background-color: #F5F5F5;
		overflow: hidden;
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

	.address-list {
		// height: 200rpx;
		width: 100vw;
		background-color: #fff;
		margin-top: 120rpx;
		/*#ifdef APP-PLUS*/
		margin-top: 180rpx;
		/*#endif*/
		padding: 0 32rpx;

		.address-item {
			padding: 32rpx 0;
			border-bottom: 2rpx solid #F4F4F4;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.address-left {
				display: flex;
				flex-direction: row;

				.radio-view {
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.person-Info {
					margin-bottom: 8rpx;
					display: flex;

					.person-text {
						font-size: 28rpx;
						color: #3D3D3D;
						font-weight: 600;
					}

					.default {
						display: flex;
						align-items: center;
						justify-content: center;
						color: #FFFFFF;
						padding: 6rpx;
						background-color: #2AC89B;
						border-radius: 4rpx;
						margin-left: 16rpx;
						font-size: 24rpx;
					}
				}

				.address-text {
					max-width: 77vw;
					font-size: 24rpx;
					color: rgba(61, 61, 61, 0.75);
					font-weight: 400;
				}
			}

			.address-right {
				.right-img {
					width: 24rpx;
					height: 24rpx;
					display: flex;
					align-items: center;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
</style>
