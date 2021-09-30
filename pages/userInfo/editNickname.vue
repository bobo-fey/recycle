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
				<view class="middle">修改姓名/昵称</view>
				<view class="right" >
					<!-- <image src="../../static/order/shaixuan.png" mode="aspectFill"></image> -->
				</view>
			</view>
		</view>
		<view class="edit-view">
			<view class="edit-top">
				<view class="edit-input">
					<input type="text" maxlength="10" focus="true" v-model="nickname" />
				</view>
				<view class="empty-btn" @click="emptyText()">
					<image src="../../static/close_fill.png" mode="aspectFill"></image>
				</view>
			</view>
			<view class="edit-bot">
				<text class="tips">最多允许输入10个汉字</text>
			</view>
		</view>
		<view class="keep-view">
			<view class="keep-btn" @click="keep()">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickname:''
			}
		},
		onLoad() {
			this.nickname =this.$queue.getData('userInfo').user_name
		},
		methods: {
			emptyText(){
				this.nickname = ''
			},
			keep(){
				if(!this.nickname){
					this.$queue.showToast('姓名昵称不能为空！')
					return;
				}
				this.$zshs.request('/web/users/account',{
					action: "name",
					mode: "setInfo",
					n: this.$queue.getData('n'),
					phone_key:this.$queue.getData('clientId'),
					user: "common",
					user_name: this.nickname
				},'POST')
				.then((res)=>{
					console.log(res);
					let temp = this.$queue.getData('userInfo')
					temp.user_name = this.nickname  //修改缓存
					this.$queue.setData('userInfo',temp)
					uni.redirectTo({
						url:'/pages/userInfo/userInfo'
					})
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
	.edit-view{
		margin-top: 116rpx;
		/*#ifdef APP-PLUS*/
		margin-top: 176rpx;
		/*#endif*/
		margin-bottom: 64rpx;
		width: 100%;
		background-color: #FFFFFF;
		padding: 24rpx 32rpx;
		.edit-top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 54rpx;
			.edit-input{
				input{
					width: calc(100vw - 16px - 64px);
					height: 50rpx;
				}
			}
			.empty-btn{
				width: 32rpx;
				height: 32rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.edit-bot{
			.tips{
				font-size: 24rpx;
				color: #999999;
				font-weight: 400;
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
