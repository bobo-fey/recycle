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
				<view class="middle">设置</view>
				<view class="right" ></view>
			</view>
		</view>
		<view class="mian">
			<view class="mian-item" @click="navTo('/pages/article_page/agreement')">
				<view class="item-left">
					用户协议
				</view>
				<view class="item-right">
					<view class="right-img">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>

				</view>
			</view>
			<view class="mian-item" @click="navTo('/pages/article_page/privacy')">
				<view class="item-left">
					隐私政策
				</view>
				<view class="item-right">
					<view class="right-img">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<view class="mian-item" @click="navTo('/pages/article_page/serviceNotice')">
				<view class="item-left">
					回收服务须知
				</view>
				<view class="item-right">
					<view class="right-img">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<view class="mian-item" @click="navTo('/pages/cancellation/cancellation')" v-if="showcancel">
				<view class="item-left">
					注销账号
				</view>
				<view class="item-right">
					<view class="right-img">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="version-view">
			<view class="mian-item" @click="getVersion()">
				<view class="item-left">
					系统更新
				</view>
				<view class="item-right">
					<text class="version">{{version}}</text>
					<view class="right-img">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showcancel:	false,
				version:null,
			}
		},
		onLoad() {
			this.showcancel = this.$queue.getData('isLogin') ? true :false
			this.version = this.$queue.getData('Version')
		},
		methods: {
			getVersion() {
				uni.showLoading({
					title: '正在获取最新版本信息...'
				})
				let onLineVersion = null
				let nowVersion = null
				this.$zshs.request('/web/users/recovery-classify',{
					mode: 'getAppInfo',
					user : 'common'
				},'POST')
					.then(res=>{
						console.log(res);
						if(res.code == 200){
							onLineVersion = res.data.version_name
							let d_url = res.data.down_url
							// let versionNews = `1、新增个人信息模块,2、新增版本信息模块`
							plus.runtime.getProperty(plus.runtime.appid, function(inf) {
								nowVersion = inf.version
								console.log(nowVersion)
								//此处请求后端获取线上版本
									uni.hideLoading();
									// 如果线上版本大于本地版本
									if (onLineVersion !== nowVersion) {
										uni.showModal({
											title: '系统更新提示',
											content:'发现新版本是否升级？',
											cancelColor:'#646464',
											confirmColor:'#F7A300',
											success(ress) {
												if (ress.confirm){
													plus.runtime.openURL(d_url);
												}
											}
										})
									} else {
										uni.showToast({
											icon: 'none',
											title: '当前已经是最新版本'
										})
									}
							})
						}
					})
				
				
			},
			navTo(url) {
				uni.navigateTo({
					url: url
				})
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
		height: calc(100vh - 44px);
		/*#ifdef APP-PLUS*/
		height: 100vh;
		/*#endif*/
		background-color: #f5f5f5;
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

	.mian {
		margin-top: 116rpx;
		/*#ifdef APP-PLUS*/
		margin-top: 176rpx;
		/*#endif*/
		padding: 0 32rpx;
		background-color: #FFFFFF;

		.mian-item {
			padding: 24rpx 0;
			border-bottom: 2rpx solid #f4f4f4;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.item-left {
				font-size: 28rpx;
				color: #3D3D3D;
				font-weight: 400;
			}

			.item-right {
				display: flex;
				align-items: center;
				justify-content: center;
				.version {
					font-size: 28rpx;
					color: #999999;
					text-align: right;
					font-weight: 400;
				}

				.right-img {
					width: 24rpx;
					height: 24rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-left: 16rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		
	}
	.version-view{
			padding: 0 32rpx;
			background-color: #FFFFFF;
			margin-top: 20rpx;
			.mian-item {
				padding: 24rpx 0;
				border-bottom: 2rpx solid #f4f4f4;
				display: flex;
				align-items: center;
				justify-content: space-between;
			
				.item-left {
					font-size: 28rpx;
					color: #3D3D3D;
					font-weight: 400;
				}
			
				.item-right {
					display: flex;
					align-items: center;
					justify-content: center;
					.version {
						font-size: 28rpx;
						color: #999999;
						text-align: right;
						font-weight: 400;
					}
			
					.right-img {
						width: 24rpx;
						height: 24rpx;
						display: flex;
						align-items: center;
						justify-content: center;
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
