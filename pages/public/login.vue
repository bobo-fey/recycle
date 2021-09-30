<template>
	<view class="content">
		<view class="close_btn" @click="toBack()">
			<image src="../../static/login/close.png" mode="aspectFill"></image>
		</view>
		<view class="welcome">
			欢迎登陆回收猿
		</view>
		<view class="input_view">
			<view class="phone_number">
				<input type="number" maxlength="11" v-model="phoneNumber" placeholder="手机号" />
			</view>
			<view class="psw_number">
				<input type="number" maxlength="6" v-model="password" placeholder="验证码" />
				<view class="code_btn" @click="getCode()">
					{{isGetCode? codeNum : tips}}
				</view>
			</view>
		</view>
		<view class="agreement_view">
			<view class="check_btn">
				<u-checkbox shape="circle" @change="checkboxChange" style="transform:scale(1) " active-color='#f7a300'
					v-model="checked"> </u-checkbox>
			</view>
			<view class="agreement_text">
				我已阅读并同意<navigator class="link" url="/pages/article_page/agreement">《回收猿用户协议》</navigator>及<navigator
					class="link" url="/pages/article_page/privacy">《隐私政策》</navigator>
				，并授权回收猿使用此账号信息（如昵称、头像、收货地址）进行统一管理。
			</view>
		</view>
		<view class="login_btn" @click="toLogin()">
			<text class="login_text">立即登陆</text>
		</view>
		<view class="tips" @click="navto('/pages/public/bandPhoneNumber')">
			未注册的手机号验证后自动创建回收猿APP账户
		</view>
		<view class="wechatLogin_btn">
			<view class="weixin" type="default" @click="weixinLogin()" plain="true">
				<view class="wechat_img">
					<image src="../../static/login/wechat.png" mode="aspectFill"></image>
				</view>
				<view class="wechat_tips">
					微信登陆
				</view>
			</view>
		</view>
		<view class="help" @click="help()">
			遇到问题？
		</view>
		<view class="modal-view">
			<u-modal v-model="showModal" :show-cancel-button="true" :show-title="showTitle" @confirm="confirm"
				:content="content"></u-modal>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showTitle: false,
				showModal: false,
				checked: false,
				phoneNumber: '',
				password: '',
				codeNum: 120,
				isGetCode: false,
				content: '拨打客服电话：(0759)3325722',
				prevPage: '',
				tips:'获取验证码'
			}
		},
		onLoad() {
			let pages = getCurrentPages()
			this.prevPage = pages[pages.length - 2].route; //上一页面
		},
		methods: {
			navto(url){
				uni.navigateTo({
					url:url
				})
			},
			weixinLogin() {
				if (!this.checked) {
					this.$queue.showToast('请认真阅读并勾选用户协议与隐私政策！')
					return;
				}
				uni.login({
					provider:'weixin',
					success:loginRes=>{
						console.log(loginRes);
					},
					fail:err=>{
						console.log(err);
					}
				})
				
				let _this = this
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						console.log(res);
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								onlyAuthorize:true,
								success: function(loginRes) {
									// console.log('-------获取openid(unionid)-----');
									// console.log(JSON.stringify(loginRes));
									_this.$queue.setData('wx_authResult',JSON.stringify(loginRes.authResult))
									// 获取用户信息
									uni.getUserInfo({
										provider: 'weixin',
										success: function(infoRes) {
											console.log('-------获取微信用户所有-----');
											// console.log(JSON.stringify(infoRes.userInfo));
											_this.$queue.setData('wx_userInfo',JSON.stringify(infoRes.userInfo))
										}
									});
									let timestamp = new Date().getTime();
									_this.$zshs.request('/web/users/user-wx',{
										mode:"sns_auth",
										user:"common",
										timeStamp:timestamp,
										access_token:loginRes.authResult.access_token,
										openid:loginRes.authResult.openid,
										unionid:loginRes.authResult.unionid,
										phone_key:uni.getStorageSync('clientId')
									},'POST')
										.then(res=>{
											console.log(res);
											if(res.code == 200){
												if(res.data.code == 0){
													_this.$queue.setData('isLogin', true)
													_this.$queue.setData('token', res.data.access_token)
													_this.$queue.setData('userId', res.data.id)
													_this.$queue.setData('n', res.data.n)
													uni.switchTab({
														url:'/pages/user/user'
													})
												}else {
													uni.navigateTo({
														url:'/pages/public/bandPhoneNumber'
													})
												}
											}else{
												_this.$queue.showToast('res.code:'+res.code)
											}
										})
										.catch(err=>{
											// _this.$queue.showToast('服务器链接失败')
											console.log(err);
										})
								},
								fail: function(res) {	
									console.log("App微信获取用户信息失败", res);
									uni.showToast({
										title:'微信客户端未安装，请安装登陆后重试',
										icon:'none'
									})
								}
							})
						} else {
							uni.showToast({
								title: '该设备并未安装微信，请安装登陆后重试'
							})
						}
					},
					fail: function(err) {
						console.log(err);
					}
				})
			},
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
				if (!this.checked) {
					this.$queue.showToast('请认真阅读并勾选用户协议与隐私政策！')
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
						if (res.code === 200) {
							console.log(res.data);
							if (res.data.code === 0) {
								// uni.hideLoading()
								this.$queue.setData('token', res.data.access_token)
								this.$queue.setData('userId', res.data.id)
								this.$queue.setData('n', res.data.n)
								this.$queue.setData('isLogin', true)
								console.log(this.prevPage);
								if (this.prevPage == 'pages/user/user') {
									console.log('跳转user');
									uni.switchTab({
										url: '/pages/user/user'
									})
								} else if (this.prevPage == 'pages/recovery/recovery') {
									console.log('跳转recovery');
									uni.switchTab({
										url: '/pages/recovery/recovery'
									})
								} else if (this.prevPage == 'pages/index/index') {
									console.log('跳转index');
									uni.switchTab({
										url: '/pages/index/index'
									})
								} else {
									uni.navigateBack({})
								}
							} else {
								this.$queue.showToast(res.data.message)
								return;
							}
						}
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
								let that = this
								this.isGetCode = true
								let time = 120;
								let timer = setInterval(function() {
									// 定时器到底了 兄弟们回家啦
									if (time == 1) {
										clearInterval(timer);
										that.isGetCode = false
										that.tips = '重新获取验证码'
									} else {
										time--;
										that.codeNum = time + '';
									}
								}, 1000)
								this.$queue.showToast(res.data.message)
							}
						}
					})
			},
			checkboxChange(e) {
				console.log(e);
				this.checked = e.value;
			},
			help() {
				this.showModal = true
			},
			toBack() {
				// uni.switchTab({
				// 	url: '/pages/user/user'
				// })
				uni.navigateBack({})
			},
			confirm(e) {
				uni.makePhoneCall({
					phoneNumber: '(0759)3325722',
					success: (res) => {
						console.log('调用成功!', res)
					},
					fail: (res) => {
						console.log('调用失败!', res)
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		overflow: hidden;
		width: 100vw;
		// height: calc(100vh - 44px);
		padding: 0 64rpx;
		// padding-top: 88rpx;
	}

	.close_btn {
		position: absolute;
		top: 62rpx;
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
		font-size: 48rpx;
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
				width: 60vw;
				height: 88rpx;
			}
		}

		.psw_number {
			background-color: #F5F5F5;
			border-radius: 44rpx;
			padding: 0 48rpx;
			position: relative;

			input {
				width: 60vw;
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

	.tips {
		font-size: $uni-font-size-sm;
		color: #999999;
		font-weight: 400;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 40rpx;
	}

	.wechatLogin_btn {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		.weixin {
			width: 20vw;
			height: 20vw;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border: 1px solid #F2F2F2;
			border-radius: 20vw;
		}

		.wechat_img {
			image {
				width: 72rpx;
				height: 72rpx;
			}
		}

		.wechat_tips {
			font-size: $uni-font-size-sm;
			color: #646464;
			font-weight: 400;
		}
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
