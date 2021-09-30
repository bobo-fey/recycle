<template>
	<view class="content">
		<!-- 占位符 -->
		<view class="empty"></view>
		<view class="top-view">
			<view class="success-img">
				<image src="../../static/success.png" mode="aspectFill"></image>
			</view>
			<view class="success-text">
				<view class="success-top">发布成功</view>
				<view class="success-bot">回收商接单后会在24小时内联系您</view>
			</view>
		</view>
		<view class="bot-view">
			<view class="terms">回收服务须知</view>
			<view class="terms-box">
				<view class="terms-item">1、免费上门回收，不另外加上门费、交通费、预约费等费用。</view>
				<view class="terms-item">2、请认真核查回收员的工作证等证件，如遇危险请立即报警。</view>
				<view class="terms-item">3、交易应秉承合法、公平、透明、合理的原则进行。</view>
				<view class="terms-item">4、 交易物品应为正规渠道物品，并保证对交易物品拥有合法、完整的处分权利若为非法渠道获得物品，有权向公安司法机关报案，并将物品转交公安司法机关。</view>
				<view class="terms-item">5、为了保证您的隐私，回收可要求回收员当场处理隐私信息，如数据格式化、账号退出等。</view>
			</view>
		</view>
		<view class="bot-tabbar">
			<view class="btn-item yel-color" @click="navTo()"> 
				查看订单
			</view>
			<view class="btn-item" @click="navTo(1)">
				返回首页
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId:''
			}
		},
		onLoad(options) {
			if(options.orderId){
				this.orderId = options.orderId
			}
		},
		methods: {
			navTo(temp){
				if(temp === 1){
					uni.switchTab({
						url:'/pages/index/index'
					})
				}else{
					this.$queue.navTo('/pages/order/orderDetail?orderId=' + this.orderId)
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		width: 100vw;
		overflow: hidden;
	}
	.empty{
		width: 100vw;
		height: 60rpx;
		background-color:$uni-mbg-color;
	}
	.top-view{
		width: 100vw;
		height: 352rpx;
		background-color: #FFD426;
		display: flex;
		align-items: center;
		justify-content: center;
		.success-img{
			width: 96rpx;
			height: 96rpx;
			margin-right: 16rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.success-text{
			display: flex;
			flex-direction: column;
			.success-top{
				font-size: 32rpx;
				color: #3D3D3D;
				font-weight: 500;
			}
			.success-bot{
				font-size: 24rpx;
				color: rgba(61,61,61,0.75);
				font-weight: 400;
			}
		}
	}
	.bot-view{
		width: 100vw;
		padding: 48rpx;
		.terms{
			font-size: 28rpx;
			color: #3D3D3D;
			font-weight: 600;
			margin-bottom: 32rpx;
		}
		.terms-box{
			.terms-item{
				font-size: 24rpx;
				color: #646464;
				line-height: 48rpx;
				font-weight: 400;
			}
		}
	}
	.bot-tabbar{
		width: 100vw;
		height: 98rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		background-color:#F5F5F5;
		display: flex;
		.btn-item{
			width: calc(100vw / 2);
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			color: #646464;
			font-weight: 600;
		}
		.yel-color{
			color: #F7A300;
		}
	}
</style>
