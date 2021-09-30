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
				<view class="middle">订单评价</view>
				<view class="right">
					<image src="../../static/order/kefu.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view class="level-view">
			<view class="start-view">
				<view class="start-item" v-for="(item,index) in 5" :key="index" @click="chooseStart(index)">
					<image src="../../static/order/red-start.png" mode="aspectFill" v-if="item <=startNum"></image>
					<image src="../../static/order/hei-start.png" mode="aspectFill" v-else></image>
				</view>
			</view>
			<view class="comment-text">
				总体评价：较好
			</view>
		</view>
		<view class="fault-view">
			<view class="fault-item" :class="current == index ? 'yc' :''" v-for="(item,index) in 5" :key="index" @click="tapItem(index)">
				功能完好
			</view>
			<!-- <view class="fault-item">
				无法启动
			</view>
			<view class="fault-item">
				无法制冷
			</view>
			<view class="fault-item">
				无法制热
			</view>
			<view class="fault-item">
				无法遥控
			</view> -->
			<view class="fault-item">
				其他
			</view>
		</view>
		<view class="btn-view">
			<view class="submit-btn">
				提交
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow:false,
				reason:'',
				otherReason:'',
				startNum:1,
				current:0,
				list: [
					{
						value: '1',
						label:'无理由',
					},
					{	
						value: '2',
						label:'钱太少',
						},
					{
						value: '3',
						label:'暂无时间',
					},
					{
						value: '4',
						label:'已经回收',
					},
					]
			}
		},
		methods: {
			tapItem(index){
				this.current = index
				
			},
			chooseStart(index){
				this.startNum = index+1
			},
			back(){
				uni.navigateBack({})
			},
			showPicker(){
				this.isShow = true
			},
			confirm(e){
				console.log(e);
				this.reason = e[0].label
				console.log(this.reason );
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
	.title-bar{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
	}
	.empty{
		width: 100vw;
		height: 60rpx;
		background-color: #FFFFFF;
	}
	.title-view{
		width: 100vw;
		height: 88rpx;
		background: #FFFFFF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 32rpx;
		.left{
			width: 40rpx;
			height: 40rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.middle{
			font-size: 32rpx;
			color: #3D3D3D;
			font-weight: bold;
		}
		.right{
			width: 40rpx;
			height: 40rpx;
			image{
				width: 100%;
				height: 100%;
			} 
		}
	}
	.level-view{
		height: 200rpx;
		width: 100vw;
		background-color: #fff;
		margin-top: 120rpx;
		/*#ifdef APP-PLUS*/
		margin-top: 180rpx;
		/*#endif*/
		padding: 64rpx 0 56rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 32rpx;
		.start-view{
			margin-bottom: 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.start-item{
				display: flex;
				width: 64rpx;
				height: 64rpx;
				margin-right: 24rpx;
				&:nth-child(5){
					margin-right: 0;
				}
				image{
					width: 100%;
					height: 100%;
				}
			}
			
		}
		.comment-text{
			font-size: 28rpx;
			color: #3D3D3D;
			text-align: center;
			font-weight: 400;
		}
		
	}
	.fault-view{
		width: 100vw;
		background-color: #FFFFFF;
		padding: 32rpx;
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 64rpx;
		.fault-item{
			padding: 16rpx;
			white-space: nowrap;
			margin-right: 23rpx;
			margin-bottom: 24rpx;
			border: 2rpx solid #646464;
			border-radius: 8rpx;
		}
		.yc{
			color:#F7A300;
			border: 2rpx solid #F7A300;
		}
	}
	.btn-view{
		width: 100vw;
		padding: 0 32rpx;
		.submit-btn{
			width: 100%;
			height: 88rpx;
			background: #FFD426;
			border-radius: 44rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			color: #3D3D3D;
			text-align: center;
			font-weight: 400;
		}
	}
</style>
