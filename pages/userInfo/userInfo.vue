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
				<view class="middle">我的信息</view>
				<view class="right" >
					<!-- <image src="../../static/order/shaixuan.png" mode="aspectFill"></image> -->
				</view>
			</view>
		</view>
		<view class="avator" @click="chooseImage()">
			<view class="avator-left">
				头像
			</view>
			<view class="avator-right">
				<image :src="avatorImg" mode="aspectFill"></image>
			</view>
		</view>
		<view class="info-view">
			<view class="info-item">
				<view class="info-left">
					用户ID
				</view>
				<view class="info-right">
					<view class="id-num">
						{{userId}}
					</view>
				</view>
			</view>
			<view class="info-item" @click="navTo('/pages/userInfo/editNickname')">
				<view class="info-left">
					姓名/昵称
				</view>
				<view class="info-right">
					<view class="info-text">{{userName}}</view>
					<view class="right-img">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>

			</view>
			<view class="info-item" @click="showPicker()">
				<view class="info-left">性别</view>
				<view class="info-right">
					<view class="info-text">
						{{sex}}
					</view>
					<view class="right-img">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<view class="info-item" @click="navTo('/pages/userInfo/authentication')">
				<view class="info-left">绑定手机号</view>
				<view class="info-right">
					<view class="info-text">
						{{phoneNumber}}
					</view>
					<view class="unbound">
						解绑
					</view>
					<view class="right-img">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<view class="info-item" v-if="weixin">
				<view class="info-left">绑定微信</view>
				<view class="info-right">
					<view class="info-text">
						WXID_349238749424342
					</view>
					<view class="right-img">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="select-view">
			<u-select v-model="isShow" title='性别' @default-value="defaultValue" :list="list" @confirm="confirm"
				cancel-color="#999999" confirm-color="#F7A300"></u-select>
		</view>
	</view>
</template>

<script>
	import {BASE_URL} from'../../common/config.js'
	export default {
		data() {
			return {
				avatorImg: '../../static/user/avator.png',
				isShow: false,
				sex: '不详',
				userId: null,
				userName: '',
				userInfo: {},
				defaultValue: 0,
				phoneNumber: '',
				weixin: false,
				list: [{
						value: '1',
						label: '男',
					},
					{
						value: '2',
						label: '女',
					}
				],
			}
		},
		// onLoad() {
		// 	console.log(BASE_URL);
		// 	this.baseUrl =BASE_URL
		// },
		onShow() {
			console.log(this.avatorImg );
			this.userInfo = this.$queue.getData('userInfo')
			this.avatorImg =this.userInfo.user_img == '-'? this.avatorImg : this.userInfo.user_img
			this.userName = this.userInfo.user_name
			this.userId = this.userInfo.id
			this.sex = this.userInfo.user_sex == 0 ? '不详' : this.userInfo.user_sex == 1 ? '男' : '女'
			this.defaultValue = this.userInfo.user_sex == 2 ? 1 : 0 //设置选择器的默认值
			this.phoneNumber = this.userInfo.phone.substr(0, 3) + '****' + this.userInfo.phone.substr(7, 11)
			this.$forceUpdate()
		},
		methods: {
			chooseImage() {
				console.log('123');
				uni.chooseImage({
					sourceType: ['camera', 'album'],
					count: 1,
					success: (res) => {
						console.log('1');
						console.log(res.tempFilePaths);
						let cacheImg = res.tempFilePaths[0]
						// this.avatorImg = cacheImg
						let temp ={
							mode:'logo_change',
							user : 'common',
							n:this.$queue.getData('n'),
							phone_key:this.$queue.getData('clientId')
						}
						let jmdate = this.$zshs.getAES(JSON.stringify(temp))
						// let date = {'data':jmdate}
						uni.uploadFile({
						            url: BASE_URL +'/web/users/logo', //仅为示例，非真实的接口地址
						            filePath:cacheImg,
						            name: 'logo_img_file',
									header: {
										// 'content-type':'application/x-www-form-urlencoded;charset=utf-8',
										'user': 'common',
										'Authorization': 'Bearer' + ' ' + uni.getStorageSync("token") || '',
									},
						            formData: {
										data:jmdate
									},
						            success: (uploadFileRes) => {
										console.log(uploadFileRes);
						                console.log(uploadFileRes.data);
										let d_path=uploadFileRes.data.substr(0,uploadFileRes.data.length-1);
											d_path=d_path.substr(1,d_path.length-1);
											console.log(d_path);
										let ress = JSON.parse(this.$zshs.getDAes(d_path))
										console.log(ress);
										if(ress.code == 200){
											if(ress.data.code === 0){
												this.$queue.showToast('上传头像成功')
												this.avatorImg = ress.data.logo
												console.log(this.avatorImg);
												this.$queue.setData('userImg',this.avatorImg)
											}else{
												this.$queue.showToast('上传失败！' + ress.data.msg)
											}
										}
											
						            }
							})
					}
				})
			},
			confirm(e) {
				this.sex = e[0].label
				let sexIndex = e[0].value
				this.$zshs.request('/web/users/account', {
						action: "sex",
						mode: "setInfo",
						n: this.$queue.getData('n'),
						phone_key: this.$queue.getData('clientId'),
						user: "common",
						user_sex: sexIndex
					}, 'POST')
					.then((res) => {
						console.log(res);
						if (res.code == 200) {
							if (res.data.code == 0) {
								this.$queue.showToast('修改成功！')
							} else {
								this.$queue.showToast('请求失败！')
							}
						} else {
							this.$queue.showToast('服务器发生错误！')
						}

					})
			},
			showPicker() {
				this.isShow = true
			},
			navTo(url) {
				this.$queue.navTo(url)
			},
			back(){
				uni.navigateBack({})
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

	.avator {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #FFFFFF;
		padding: 32rpx;
		
		margin: 32rpx 0;
		margin-top: 116rpx;
		/*#ifdef APP-PLUS*/
		margin-top: 176rpx;
		/*#endif*/

		.avator-left {
			font-size: 28rpx;
			color: #646464;
			text-align: center;
			font-weight: 400;
		}

		.avator-right {
			width: 112rpx;
			height: 112rpx;
			border-radius: 56rpx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.info-view {
		background-color: #FFFFFF;
		padding: 0 32rpx;

		:nth-last-child(1) {
			border: none !important;
		}

		.info-item {
			padding: 24rpx 0;
			border-bottom: 2rpx solid #f4f4f4;
			display: flex;
			align-items: cenetr;
			justify-content: space-between;

			.info-left {
				font-size: 28rpx;
				color: #646464;
				font-weight: 400;
			}

			.info-right {
				display: flex;
				align-items: center;

				.id-num {
					font-size: 28rpx;
					color: #999999;
					text-align: right;
					font-weight: 400;
				}

				.info-text {
					font-size: 28rpx;
					color: #3D3D3D;
					text-align: right;
					font-weight: 400;
				}
				.unbound{
					margin: 0 4rpx;
					color: #F7A300;
				}
				.right-img {
					width: 24rpx;
					height: 24rpx;
					display: flex;
					align-items: center;
					margin-left: 16rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
</style>
