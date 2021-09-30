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
				<view class="middle">绑定新手机</view>
				<view class="right" ></view>
			</view>
		</view>
		<view class="auth-view">
			<view class="auth-item">
				<view class="auth-left">
					新手机号
				</view>
				<view class="auth-right">
					<input type="number" v-model="phoneNumber" />
				</view>
			</view>
			<view class="auth-item">
				<view class="auth-left">
					验证码
				</view>
				<view class="code-input">
					<input type="number" v-model="code" />
				</view>
				<view class="auth-right yt" @click="getCode()">
					 {{isGetCode? codeNum : "获取验证码"}}
				</view>
			</view>
		</view>
		<view class="keep-view">
			<view class="keep-btn" @click="keepChange">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isGetCode:false,
				codeNum:120,
				phoneNumber:'',
				code:''
			}
		},
		methods: {
			keepChange(){
				this.$zshs.request('/web/users/sms',{
					"mode":"changePhoneNo",
					"code":this.code,
					"phone_no_new":this.phoneNumber,
					"phone_no_old":this.$queue.getData('oldNumber'),
					"phone_key":uni.getStorageSync('clientId'),
					"user":"common",
					"n":uni.getStorageSync('n'),
					"token":this.$queue.getData('change_token'),
				},'POST')
				.then(res=>{
					console.log(res);
					if(res.code == 200){
						if(res.data.code ==0){
							uni.showToast({
								icon:'none',
								title:'修改成功！'
							})
							setTimeout(()=>{
								uni.switchTab({
									url:'/pages/user/user'
								})
							},1000)
						}else{
							uni.showToast({
								icon:'none',
								title:res.data.message
							})
						}
					}
				})
			},
			getCode(){
				let that = this
				this.isGetCode = true
				let time = 120;
				let timer = setInterval(function() {
					// 定时器到底了 兄弟们回家啦
					if (time == 1) {
						clearInterval(timer);
						that.isGetCode = false
					} else {
						time--;
						that.codeNum = time + '';
					}
				}, 1000)
				this.$zshs.request('/web/users/sms', {
						mode: 'getCode',
						phone_no: this.phoneNumber,
						use_to: '注册/登陆',
						phone_key:uni.getStorageSync('clientId'),
						user: 'common'
					}, 'POST')
					.then((res) => {
						console.log(res)
						if (res.code === 200) {
							if(res.data.code ==0){
								uni.hideLoading()
								this.$queue.showToast(res.data.message)
							}
						}
					})
			},
			back(){
				uni.navigateBack({})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		width: 100vw;
		height:100vh;
		background-color: #F5F5F5;
		overflow: hidden;
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
		}
	}
	.auth-view{
		margin-top: 116rpx;
		/*#ifdef APP-PLUS*/
		margin-top: 176rpx;
		/*#endif*/
		margin-bottom: 64rpx;
		width: 100%;
		background-color: #FFFFFF;
		.auth-item{
			padding: 24rpx 32rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.auth-left{
				font-size: 28rpx;
				color: #646464;
				font-weight: 400;
			}
			.auth-right{
				font-size: 28rpx;
				color: #3D3D3D;
				text-align: right;
				font-weight: 400;
			}
			.yt{
				color: #F7A300;
			}
		}
	}
	.keep-view{
		width: 100vw;
		padding: 0 32rpx;
		.keep-btn{
			width: 100%;
			height: 88rpx;
			font-size: 32rpx;
			color: #3D3D3D;
			font-weight: 400;
			background: #FFD426;
			border-radius: 44rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
