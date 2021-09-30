<template>
	<web-view src="http://www.jiadianhuishou.com/aboutus/"></web-view>
	<!-- <view class="content">
		<view class="bgImg">
			<image src="../../static/company.png" mode="aspectFill"></image>
		</view>
		<view class="text-box">
			<view class="company">
				湛江市致尚网络科技有限公司
			</view>
			<view class="company-detail">
				致尚网络 成立于2013年，成立伊始，公司凭借其业内领先的技术，迅速崛起成为***的无线业务提供商；公司已拥有庞大的无线广告网络、领先的无线广告系统、专业出色的网络营销技术平台，提供一站式的无线营销和无线广告投放咨询、执行服务，旗下囊括数千家移动无线网站，整合营销资源，为广大手机用户提供优质手机广告服务，赢得了合作伙伴及业界的广泛好评. 2013年，为加强对营销资源的整合，公司瞄准Android IOS 智能机操作平台，并与多个手机厂商及应用开发者合作，为其提供整合和产品发布、广告投放的服务。致尚人倡导“诚实、团结、上进、创新”的企业文化，具有良好有效的内部运转管理机制.品致人的快乐工作、务实工作的信念，吸引了一批年轻的、有冲劲、具有实干精神的人才。
			</view>
			<view class="type-title">
				联系电话
			</view>
			<view class="phoneNumber">
				(0759)2330888
			</view>
			<view class="type-title">
				联系地址
			</view>
			<view class="address">
				湛江开发区绿华路48号华都汇7号综合楼1108号办公室
			</view>
		</view>
	</view> -->
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		width: 100vw;
		min-height: calc(100vh - 44px);
	}
	.bgImg{
		width: 90%;
		height: 200rpx;
		margin: auto;
		border-radius: 12rpx;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.text-box{
		width: 100%;
		height: 100%;
		padding: 20rpx;
	}
	.company{
		font-size: 36rpx;
		font-weight: 700;
		margin: 40rpx 0;
	}
	.company-detail{
		font-size: 28rpx;
		color: #3D3D3D;
		margin-bottom: 50rpx;
	}
	.type-title{
		color: #3D3D3D;
		margin-bottom: 10rpx;
	}
	.phoneNumber{
		color: #000000;
		margin-bottom: 10rpx;
	}
	.address{
		color: #000000;
		font-size: 32rpx;
	}
</style>
