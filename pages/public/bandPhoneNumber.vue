<template>
	<view class="content">
		<view class="close_btn" @click="toBack()">
			<image src="../../static/login/close.png" mode="aspectFill"></image>
		</view>
		<view class="welcome">
			为了账户安全，请绑定手机号
		</view>
		<view class="input_view">
			<view class="phone_number">
				<input type="number" v-model="phoneNumber" placeholder="手机号" />
			</view>
			<view class="psw_number">
				<input type="number" v-model="password" placeholder="验证码" />
				<view class="code_btn" @click="getCode()">
					{{isGetCode? codeNum : "获取"}}
				</view>
			</view>
		</view>
		<!-- <view class="agreement_view">
			<view class="check_btn">
				<u-checkbox shape="circle" @change="checkboxChange"  style="transform:scale(1) " active-color='#f7a300' v-model="checked"> </u-checkbox>
			</view>
			<view class="agreement_text">
				我已阅读并同意<navigator class="link">《回收猿用户协议》</navigator>及<navigator class="link">《隐私政策》</navigator>
				，并授权回收猿使用此账号信息（如昵称、头像、收货地址）进行统一管理。
			</view>
		</view> -->
		<view class="login_btn"  @click="toLogin()">
			<text class="login_text">立即绑定</text>
		</view>
		<!-- <view class="tiaoguo">
			跳过绑定，立即登陆
			<view class="tiaozhaun">
				<image src="../../static/home/dian.png" mode="aspectFill"></image>
			</view>
		</view> -->
		<view class="help">
			遇到问题？
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checked:false,
				phoneNumber: '',
				password: '',
				codeNum:120,
				isGetCode:false
			}
		},
		methods: {
			toLogin() { //登陆
				if (this.phoneNumber) { //手机号码校验
					console.log(this.phoneNumber)
					var myreg = /^1[3-9]\d{9}$/;
					if (!myreg.test(this.phoneNumber)) {
						this.$queue.showToast('请输入正确的手机号码！')
						return;
					}
				} else {
					this.$queue.showToast('请输入手机号码！')
					return;
				}
				if (!this.password) {
					this.$queue.showToast('请输入验证码！')
					return;
				}
				this.$zshs.request('/web/users/sms', {
						mode: 'login',
						code: this.password,
						phone_no: this.phoneNumber,
						use_to: '注册/登陆',
						phone_key: uni.getStorageSync('clientId'),
						user: 'common'
					}, 'POST')
					.then((res) => {
						console.log(res)
						if (res.code === 200){
							console.log(res.data);
							if (res.data.code === 0) {
								this.$queue.setData('token', res.data.access_token)
								this.$queue.setData('userId', res.data.id)
								this.$queue.setData('n', res.data.n)
								
								this.bandPhoneNumber()
							} else {
								this.$queue.showToast(res.data.message)
								return;
							}
						}
					})
			},
			bandPhoneNumber(){
				console.log('111111111111111111');
				let wx_authResult = JSON.parse(this.$queue.getData('wx_authResult'))
				let wx_userInfo = JSON.parse(this.$queue.getData('wx_userInfo'))
				let data = {
					mode:"addUserWxInfo",
					user:"common",
					n:this.$queue.getData('n'),
					phone_key:this.$queue.getData('clientId'),
					openid:wx_authResult.openid,
					unionid:wx_authResult.unionid,
					nickname:wx_userInfo.nickName,
					sex:wx_userInfo.gender,
					province:wx_userInfo.province,
					city:wx_userInfo.city,
					country:wx_userInfo.country,
					headimgurl:wx_userInfo.avatarUrl,
					privilege:'-'
				}
				// console.log(data);
				this.$zshs.request('/web/users/user-wx',data,'POST')
					.then(res=>{
						console.log(res);
						if(res.code ==200){
							if(res.data.code == 0){
								this.$queue.setData('isLogin', true)
								uni.switchTab({
									url: '/pages/index/index'
								})
							}else{
								this.$queue.showToast(res.data.message)
							}
						}else{
							this.$queue.showToast('code:'+res.code)
						}
						
					})
					.catch(err=>{
						console.log(err);
					})
			},
			getCode() { //获取验证码
				console.log('获取验证码');
				if (this.isGetCode) {
					return;
				}
				if (this.phoneNumber) { //手机号码校验
					console.log(this.phoneNumber)
					var myreg = /^1[3-9]\d{9}$/;
					if (!myreg.test(this.phoneNumber)) {
						this.$queue.showToast('请输入正确的手机号码！')
						return;
					}
				} else {
					this.$queue.showToast('请输入手机号码！')
					return;
				}
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
				console.log(uni.getStorageSync('clientId'))
				this.$zshs.request('/web/users/sms', {
						mode: 'getCode',
						phone_no: this.phoneNumber,
						use_to: '注册/登陆',
						phone_key: uni.getStorageSync('clientId'),
						user: 'common'
					}, 'POST')
					.then((res) => {
						console.log(res)
						if (res.code === 200) {
							if (res.data.code == 0) {
								uni.hideLoading()
								this.$queue.showToast(res.data.message)
							}
						}
					})
			},
			checkboxChange(e){
				this.checked = e.value;
			},
			toBack(){
				uni.switchTab({
					url:'/pages/user/user'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		overflow: hidden;
		width: 100vw;
		padding: 0 64rpx;
	}

	.close_btn {
		position: absolute;
		top: 32rpx;
		left: 48rpx;
		/*#ifdef APP-PLUS*/
		top: 150rpx;
		/*#endif*/
		width: 50rpx;
		height: 50rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}

	.welcome {
		font-family: PingFangSC-Semibold;
		font-size: 34rpx;
		color: #3D3D3D;
		font-weight: 600;
		margin-top: 260rpx;
		margin-bottom: 72rpx;
	}

	.input_view {
		margin-bottom: 60rpx;

		.phone_number {

			background-color: #F5F5F5;
			border-radius: 44rpx;
			padding: 0 48rpx;
			margin-bottom: $uni-spacing-col-lg;

			input {
				height: 88rpx;
			}
		}

		.psw_number {
			background-color: #F5F5F5;
			border-radius: 44rpx;
			padding: 0 48rpx;
			position: relative;

			input {
				height: 88rpx;
			}
		}

		.code_btn {
			font-size: 28rpx;
			color: #F7A300;
			position: absolute;
			top: 24rpx;
			right: 32rpx;
		}
	}

	.agreement_view {
		display: flex;
		margin-bottom: 86rpx;

		.check_btn {
			// margin-right: 16rpx;
		}

		.agreement_text {
			font-size: $uni-font-size-sm;

			.link {
				display: inline;
				color: #F7A300;
				text-decoration: underline
			}
		}
	}
	.login_btn {
		height: 88rpx;
		background: #FFD426;
		background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(247, 163, 0, 0.25) 100%);
		border-radius: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 32rpx;

		.login_text {
			font-size: 32rpx;
			color: #3D3D3D;
			font-weight: bold;
		}

	}

	.tiaoguo {
		margin-top: 150rpx;
		display: flex;
		justify-content: center;
		font-size: $uni-font-size-sm;
		color: $uni-mbg-color;
		font-weight: 400;
	}
	.help {
		position: absolute;
		bottom: 32rpx;
		left: 42.1%;
		font-size: $uni-font-size-sm;
		color: #999999;
		font-weight: 400;
	}
	
</style>
