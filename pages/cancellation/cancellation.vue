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
				<view class="middle">用户注销</view>
				<view class="right" ></view>
			</view>
		</view>
		<view class="mian">
			<view class="mian-top">
				<view class="bus_message">
					很遗憾，回收猿无法继续为你提供服务，感谢你一直以来的陪伴。注销账号前，我们需要对以下信息进行审核，以保证你的账号安全。
				</view>
				<view class="bus_list">
					<view class="bus_item">
						（1）自愿放弃账号及账号中的一切权益
					</view>
					<view class="bus_item">
						（2）账户内无未完成的订单和服务
					</view>
					<view class="bus_item">
						（3）无正在进行中的投诉举报或被投诉举报
					</view>
					<view class="bus_item">
						（4）账户当前为有效账户，非冻结状态
					</view>
				</view>
			</view>
			<view class="mian-bot">
				<view class="agreement_view">
					<view class="check_btn">
						<u-checkbox shape="square" @change="checkboxChange" style="transform:scale(1) " active-color='#f7a300'
							v-model="checked"> </u-checkbox>
					</view>
					<view class="agreement_text">
						申请注销即表示您自愿放弃账号并同意<navigator class="link" url='/pages/article_page/privacy'>《隐私政策》</navigator>
						中的注销条款。
					</view>
				</view>
				<view class="concat_btn" @click="concat()">
					电话联系客服，并注销账号
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checked:false,
				phoneNumber: '0759-3325722' ,//客服电话
			}
		},
		methods: {
			concat(){
				console.log(this.checked);
				if (this.checked) {
					uni.makePhoneCall({
						phoneNumber: this.phoneNumber,
						success: (res) => {
							console.log('调用成功!', res)
						},
						fail: (res) => {
							console.log('调用失败!', res)
						} 
					})
				} else {
					this.$queue.showToast('请阅读及同意《隐私政策》中的注销条款')
				}
			},
			checkboxChange(e) {
				this.checked = e.value;
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
	.mian{
		margin-top: 116rpx;
		/*#ifdef APP-PLUS*/
		margin-top: 176rpx;
		/*#endif*/
		padding: 0 32rpx;
		background-color: #FFFFFF;
	}
	.mian-top{
		font-size: 32rpx;
		.bus_message{
			
		}
		.bus_list{
			margin-top: 60rpx;
		}
	}
	.mian-bot{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.agreement_view {
			display: flex;
			margin-top: 60rpx;
			margin-bottom: 80rpx;
			font-weight: 700;
			.check_btn {
				display: flex;
				align-items: center;
			}
		
			.agreement_text {
				font-size: $uni-font-size-sm;
				font-size: 28rpx;
				font-weight: 800;
				color: #000000;
				.link {
					display: inline;
					color: #F7A300;
					text-decoration: underline
				}
			}
		}
		.concat_btn{
			width: 80vw;
			height: 85rpx;
			line-height: 85rpx;
			border-radius: 85rpx;
			background-color:#ffd426;
			text-align: center;
			font-size: 32rpx;
			font-weight: 800;
		}
	}
	
</style>
