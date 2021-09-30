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
				<view class="middle">取消订单</view>
				<view class="right">
					<image src="../../static/order/kefu.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view class="reason-view">
			<view class="reason" @click="showPicker()">
				<view class="reason-left" >
					<view class="reason-title">原因</view>
					<view class="red-proint">*</view>
				</view>
				<view class="reason-right">
					<view class="reason-text">
						{{reason}}
					</view>
					<view class="right-img">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<view class="other-reason" v-if="showOther">
				<view class="other-text">
					其他
				</view>
				<view class="other-input">
					<textarea class="other-area" v-model="otherReason" placeholder="说明您的原因..." />
				</view>
			</view>
		</view>
		<view class="btn-view">
			<view class="submit-btn" @click="submit()">
				提交
			</view>
		</view>
		<!-- 选择器 -->
		<view class="reason-picker">
			<u-select v-model="isShow" title='取消原因'  :list="list" @confirm="confirm" cancel-color="#999999" confirm-color="#F7A300"></u-select>
			<!-- <u-picker mode="selector" :default-selector="[0]" v-model="isShow" :range="selector" cancel-color="#999999" confirm-color="#F7A300" @confirm="confirm"></u-picker> -->
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
				showOther:false,
				cancel_id:'',
				list: [
					{
						value: '1',
						label:'已被他人回收',
					},
					{	
						value: '2',
						label:'暂时不卖了',
						},
					{
						value: '3',
						label:'近期不方便上门回收',
					},
					{
						value: '4',
						label:'其他',
					}
					]
			}
		},
		onLoad(options) {
			console.log(options);
			if(options.o_id) {
				this.cancel_id = options.o_id
			}
		},
		methods: {
			submit(){
				if(this.showOther){
					this.reason = this.otherReason
					console.log(this.reason);
					if(!this.reason){
						this.$queue.showToast('请选择和说明您取消订单的理由')
						this.reason ='其他'
						return;
					}
				}
				if(!this.reason){
					console.log('222222222222222222');
					this.$queue.showToast('请选择和说明您取消订单的理由')
					return;
				}
				
				console.log(this.reason);
					this.$zshs.request('/web/users/orders',{
						action: "qxdd",
						mode: "getOrders",
						n:this.$queue.getData('n'),
						o_id:this.cancel_id,
						phone_key:this.$queue.getData('clientId'),
						reason: this.reason,
						user: "common"
					},'POST')
					.then((res)=>{
						console.log(res);
						if(res.code == 200){
							if(res.data.code == 0){
								this.$queue.showToast('订单已取消')
								setTimeout(()=>{
									uni.redirectTo({
										url:'/pages/order/order'
									})
								},1500)
							}
						}
					})
			},
			back(){
				uni.navigateBack({})
			},
			showPicker(){
				this.isShow = true
			},
			confirm(e){
				console.log(e);
				if (e[0].value == 4) {
					this.showOther = true
				}else{
					this.showOther = false
					this.reason = e[0].label
				}
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
	.reason-view{
		// height: 200rpx;
		width: 100vw;
		background-color: #fff;
		margin-top: 120rpx;
		/*#ifdef APP-PLUS*/
		margin-top: 180rpx;
		/*#endif*/
		padding: 0 32rpx;
		.reason{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx 0;
			border-bottom: 2rpx solid #f4f4f4; 
			.reason-left{
				display: flex;
				align-items: center;
				.reason-title{
					font-size: 28rpx;
					color: #646464;
					font-weight: 400;
					margin-right: 8rpx;
				}
				.red-proint{
					height: 28rpx;
					line-height: 28rpx;
					color: #DD524D;
					font-size: 28rpx;
					font-weight: 400;
				}
			}
			.reason-right{
				display: flex;
				align-items: center;
				.reason-text{
					color: #999999;
					margin-right: 20rpx;
				}
				.right-img{
					width: 24rpx;
					height: 24rpx;
					display: flex;
					align-items: center;
					image{
						width: 100%;
						height: 100%;
					}
				}
				
			}
		}
		.other-reason{
			padding: 24rpx 0;
			
			.other-text{
				font-size: 28rpx;
				color: #646464;
				font-weight: 400;
			}
			.other-input{
				margin-top: 20rpx;
				width: 100%;
				height: 90rpx;
				.other-area{
					font-size:28rpx;
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.btn-view{
		width: 100vw;
		padding: 0 32rpx;
		margin-top: 64rpx;
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
