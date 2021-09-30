<template>
	<view class="content">
		<!-- 占位符 -->
		<view class="empty_view"></view>

		<view class="login_view"  @click="navTo('/pages/userInfo/userInfo')">
			<view class="avator" >
				<image class="avator_icon" :src="avator" mode="aspectFill"></image>
			</view>
			<view class="login_right" @click.stop="toLogin()">
				<view class="login">
					{{userName? userName : '登录/注册' }}
				</view>
				<view class="privilege">
					{{ userID ? 'id:' + userID :'登陆后享受免费上门高价回收'}}
				</view>
			</view>
		</view>
		<view class="taskbar">
			<view class="task_item"  @click="navTo('/pages/order/order?state=1')">
				<view class="task_num">{{sending}}</view>
				<view class="task_state">派单中</view>
			</view>
			<view class="task_item"  @click="navTo('/pages/order/order?state=2')">
				<view class="task_num">{{appointment}}</view>
				<view class="task_state">待预约</view>
			</view>
			<view class="task_item"  @click="navTo('/pages/order/order?state=4')">
				<view class="task_num">{{complete}}</view>
				<view class="task_state">已完成</view>
			</view>
		</view>
		<view class="operation_view">
			<view class="operation" style="margin-top: 104rpx;">
				<view class="opera_item border-bot" @click="navTo('/pages/order/order')">
					<view class="item_left">
						<view class="opera_icon">
							<image class="opera_img" src="../../static/user/order.png" mode="aspectFill"></image>
						</view>
						<view class="opera_text">
							全部订单
						</view>
					</view>
					<view class="item_right">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="opera_item border-bot" @click="navTo('/pages/userInfo/userInfo')">
					<view class="item_left">
						<view class="opera_icon">
							<image class="opera_img" src="../../static/user/myInfo.png" mode="aspectFill"></image>
						</view>
						<view class="opera_text">
							我的信息
						</view>
					</view>
					<view class="item_right">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="opera_item border-bot" @click="navTo('/pages/address/address')">
					<view class="item_left">
						<view class="opera_icon">
							<image class="opera_img" src="../../static/user/adreess.png" mode="aspectFill"></image>
						</view>
						<view class="opera_text">
							地址管理
						</view>
					</view>
					<view class="item_right">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="opera_item" @click="toUs('/pages/setting/setting')">
					<view class="item_left">
						<view class="opera_icon">
							<image class="opera_img" src="../../static/user/setting.png" mode="aspectFill"></image>
						</view>
						<view class="opera_text">
							设置&协议
						</view>
					</view>
					<view class="item_right">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<view class="operation">
				<view class="opera_item border-bot" @click="toUs('/pages/article_page/knownMore')">
					<view class="item_left">
						<view class="opera_icon">
							<image class="opera_img" src="../../static/user/help.png" mode="aspectFill"></image>
						</view>
						<view class="opera_text">
							回收指南
						</view>
					</view>
					<view class="item_right">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="opera_item border-bot" @click="concat()">
					<view class="item_left">
						<view class="opera_icon">
							<image class="opera_img" src="../../static/user/contact.png" mode="aspectFill"></image>
						</view>
						<view class="opera_text">
							联系客服
						</view>
					</view>
					<view class="item_right">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="opera_item" @click="toUs('/pages/article_page/aboutUs')">
					<view class="item_left">
						<view class="opera_icon">
							<image class="opera_img" src="../../static/user/aboutus.png" mode="aspectFill"></image>
						</view>
						<view class="opera_text">
							关于我们
						</view>
					</view>
					<view class="item_right">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<view class="operation" v-if="isLogin">
				<view class="opera_item" @click="loginOut()">
					<view class="item_left">
						<view class="opera_icon">
							<image class="opera_img" src="../../static/user/takeout.png" mode="aspectFill"></image>
						</view>
						<view class="opera_text" style="color:#F76675">
							退出
						</view>
					</view>
					<view class="item_right">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="modal-view">
			<u-modal v-model="showmodal" :show-title="showTitle" :title="modalTitle" :title-style="titleStyle"
				:confirm-text="confirmText" :show-cancel-button="true" :content="content" @confirm="comfirm"
				:confirm-color="confirmColor" :content-style ='contentStyle'>
			</u-modal>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userName:'',
				userID:'',
				avator:'../../static/user/avator.png',
				showmodal: false,
				showTitle: false,
				modalTitle: '',
				titleStyle: {
					color: '#3d3d3d'
				},
				content: '',
				confirmText: '',
				modalType: 0, //0为退出登陆  1为联系客服 
				confirmColor: '#F7A300',
				contentStyle:{},
				phoneNumber: '0759-3325722' ,//客服电话
				orderNumberList:[],
				sending:0,
				appointment:0,
				complete:0,
				isLogin:false
			}
		},
		onLoad() {
			console.log(this.$queue.getData('isLogin'));
		},
		onShow() {
			this.isLogin = this.$queue.getData('isLogin') ? true :false
			console.log('是否登陆',this.isLogin);
			if(this.$queue.getData('isLogin')){
				this.getuserInfo()
				this.getOrderNumber()
			}else{
				this.avator = '../../static/user/avator.png';
				this.userID = '';
				this.userName = '';
				this.sending = 0;
				this.appointment = 0;
				this.complete = 0;
			}
			
		},
		methods: {
			// chooseImage: async function() {
			// 	console.log('123');
			// 	uni.chooseImage({
			// 		sourceType: ['album'],
			// 		sizeType: ['original', 'compressed'],
			// 		count:1,
			// 		success: (res) => {
			// 			console.log('1');
			// 			console.log(res.tempFilePaths);
			// 			// this.imageList = this.imageList.concat(res.tempFilePaths);
			// 		}
			// 	})
			// },
			getOrderNumber(){
				this.$zshs.request('/web/users/orders', {
						mode: "getOrders",
						action: "count",
						user: 'common',
						n:uni.getStorageSync('n'),
						id:uni.getStorageSync('userId'),
						phone_key:uni.getStorageSync('clientId'),
					}, 'POST')
					.then((res) => {
						if (res.code === 200) {
							if(res.data.code === 0){
								uni.hideLoading()
								this.orderNumberList = res.data
								this.sending = this.orderNumberList.count1
								this.appointment = this.orderNumberList.count2
								this.complete = this.orderNumberList.count4
							}
						}
					})
			},
			getuserInfo(){
				this.$zshs.request('/web/users/account', {
						mode: 'getInfo',
						n:uni.getStorageSync('n'),
						id:uni.getStorageSync('userId'),
						phone_key:uni.getStorageSync('clientId'),
						user: 'common'
					}, 'POST')
					.then((res) => {
						console.log(res);
						if (res.code === 200) {
							if(res.data.code === 0){
								console.log(res);
								uni.hideLoading()
								this.userName = res.data.user_name
								this.userID = res.data.id
								this.avator = res.data.user_img === '-' ? this.avator : res.data.user_img
								this.$queue.setData('userInfo',res.data)
							}else{
								this.$queue.setData('isLogin',false)
								uni.showModal({
									title:'提示',
									content:'登录异常，请重新登陆'
								})
							}
						}else{
							this.$queue.setData('isLogin',false)
						}
					})
			},
			comfirm() {
				if (this.modalType === 0) { //退出登陆
					console.log('退出登陆');
					uni.removeStorageSync('n');
					uni.removeStorageSync('userId');
					uni.removeStorageSync('token');
					uni.removeStorageSync('userInfo');
					uni.removeStorageSync('unionid');
					uni.removeStorageSync('positionStorage');
					this.$queue.setData('isLogin',false)
					this.$queue.navTo('/pages/public/login')
					this.avator ='../../static/user/avator.png'
					this.sending = 0
					this.appointment = 0
					this.complete = 0
				} else { //联系客服
					uni.makePhoneCall({
						phoneNumber: this.phoneNumber,
						success: (res) => {
							console.log('调用成功!', res)
						},
						fail: (res) => {
							console.log('调用失败!', res)
						}
					});
				}
			},
			concat() {
				this.showmodal = true
				this.showTitle = true
				this.modalTitle = '欢迎拨打客服电话'
				this.content = 'TEL:(0759)3325722'
				this.confirmText = '拨打电话'
				this.modalType = 1
				this.contentStyle={
					color:'#F7A300'
				}
			},
			loginOut() {
				if(!this.$queue.getData('isLogin')){
					this.$queue.navTo('/pages/public/login')
				}else{
					this.showmodal = true
					this.modalTitle = ''
					this.content = '确定退出登陆？'
					this.confirmText = '退出'
					this.modalType = 0
					this.contentStyle={}
				}
			},
			navTo(url) {
				if(this.$queue.getData('isLogin')){
					this.$queue.navTo(url)
				}else{
					this.$queue.navTo('/pages/public/login')
				}
			},
			toUs(url){
				this.$queue.navTo(url)
			},
			toLogin(){
				if(!this.$queue.getData('isLogin')){
					this.$queue.navTo('/pages/public/login')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100vw;
		min-height: calc(100vh - 88rpx);
		background-color: #f5f5f5;
	}

	/*#ifdef APP-PLUS*/
	.empty_view {
		width: 100vw;
		height: 60rpx;
		background-color: $uni-mbg-color;
	}
	/*#endif*/
	.login_view {
		width: 100vw;
		height: 256rpx;
		padding: 32rpx;
		background-color: $uni-mbg-color;
		display: flex;

		.avator {
			width: 110rpx;
			height: 110rpx;
			border-radius: 55rpx;
			margin-right: 32rpx;
			overflow: hidden;
			.avator_icon {
				width: 100%;
				height: 100%;
			}
		}

		.login_right {
			height: 104rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;

			.login {
				font-family: PingFangSC-Medium;
				font-size: 32rpx;
				color: #3D3D3D;
				font-weight: bold;
			}

			.privilege {
				width: 312rpx;
				font-family: PingFangSC-Regular;
				font-size: 24rpx;
				color: rgba(61, 61, 61, 0.50);
				font-weight: 400;
			}
		}
	}

	.taskbar {
		width: 95.7%;
		height: 160rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		position: absolute;
		top: 168rpx;
		left: 16rpx;
		display: flex;
		justify-content: space-around;
		/*#ifdef APP-PLUS*/
		top: 228rpx;

		/*#endif*/
		.task_item {
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;

			.task_num {
				font-size: 40rpx;
				color: #3D3D3D;
				text-align: center;
				font-weight: 600;
			}

			.task_state {
				font-size: 24rpx;
				color: #646464;
				text-align: center;
				font-weight: 400;
			}
		}
	}

	.operation_view {
		width: 100vw;
		min-height: calc(100vh - 300rpx);
		background-color: #f5f5f5;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;

		.operation {
			width: 95.7%;
			background-color: #FFFFFF;
			border-radius: 24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 32rpx;
		}
	}

	.opera_item {
		width: 87.2%;
		height: 96rpx;
		// background-color: #007AFF;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.item_left {
			display: flex;
			white-space: nowrap;

			.opera_icon {
				width: 40rpx;
				height: 40rpx;
				margin-right: 32rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.opera_text {
				font-size: 28rpx;
				color: #3D3D3D;
				font-weight: 400;
			}
		}

		.item_right {
			image {
				width: 24rpx;
				height: 24rpx;
			}
		}
	}

	.border-bot {
		border-bottom: 2rpx solid #f4f4f4;
	}
</style>
