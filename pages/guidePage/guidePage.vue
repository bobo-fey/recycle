<template>
	<view class="content">
		<view class="swiper-view">
			<swiper class="swiper" :circular="false" :indicator-dots="true" :current="tabIndex" @change="changeTab">
				<swiper-item class="swiperItem">
					<image style="width: 70%;height: 80%;" src="../../static/guide/xxxhdpi_1p.png" mode="widthFix"></image>
				</swiper-item>
				<swiper-item class="swiperItem">
					<image style="width: 70%;height: 80%;" src="../../static/guide/xxxhdpi_2p.png" mode="widthFix"></image>
				</swiper-item>
				<swiper-item class="swiperItem">
					<image style="width: 70%;height: 80%;" src="../../static/guide/xxxhdpi_3p.png" mode="widthFix"></image>
				</swiper-item>
				<swiper-item class="swiperItem">
					<image style="width: 70%;height: 80%;" src="../../static/guide/xxxhdpi_4p.png" mode="widthFix"></image>
					<view class="enterBtn" v-if="showEnter" @click="toHomePage">
						进入回收猿
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabIndex:0,
				showEnter:false
			}
		},
		methods: {
			toHomePage(){
				uni.setStorageSync('firstOpen',true)
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
			changeTab(e){
				this.showEnter = e.detail.current === 3 ? true : false;
				console.log(e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		width: 100vw;
		height: calc(100vh - 60rpx);
		.swiper-view{
			// margin-top: 60rpx;
			width: 100vw;
			height: 100vh;
			// background-color: #00D6B2;
			.swiper{
				width: 100%;
				height: 100%;
				// background-color: #007AFF;
				.swiperItem{
					margin-top: 200rpx;
					display: flex;
					flex-direction: column;
					// justify-content: center;
					align-items: center;
					.enterBtn{
						padding: 30rpx 80rpx;
						font-size: 32rpx;
						font-weight: 700;
						color: #3D3D3D;
						border-radius: 60rpx;
						margin-top: 60rpx;
						background-color:#ffd426;
					}
				}
				/deep/.uni-swiper-dots-horizontal {
					bottom: 5%;
				}
			}
		}
	}
</style>
