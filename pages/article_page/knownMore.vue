<template>
	<web-view src="http://www.jiadianhuishou.com/help/?type=list&category=6"></web-view>
	<!-- <view class="content">
		<view class="mian-text">
			<view class="question_item">
				<text class="text-question">Q：家电回收的服务流程是什么？</text>
				<text class="text-answer">A：您可以通过线上下单，回收员接单后联系您预约上门检测回收，确认回收后现场支付回收款。</text>
			</view>
			<view class="question_item">
				<text class="text-question">Q：上门回收是否安全？</text>
				<text class="text-answer">A：线上接单回收商经过回收猿官方企业认证，上门回收员也需经过实名认证，可靠安全。</text>
			</view>
			<view class="question_item">
				<text class="text-question">Q：旧电器被回收后，里面的个人隐私会不会泄露？</text>
				<text class="text-answer">A：回收员上门检测回收时，可要求回收员对电器中的隐私数据进行清除处理。</text>
			</view>
			<view class="question_item">
				<text class="text-question">Q：旧电器回收价格是怎么定的？</text>
				<text class="text-answer">A：回收价格受市场行情、电器新旧程度、使用情况等因素影响，需由回收员现场估价。若回收价过低，您有权取消回收。</text>
			</view>
			<view class="question_item">
				<text class="text-question">Q：你们收的旧电器去哪了？</text>
				<text class="text-answer">A：成色较新的电器在正规的二手渠道中售卖或慈善捐赠，成色较差或功能残缺的电器进行环保拆解回收。</text>
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
		padding: 32rpx;
	}
	.title{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 64rpx;
		font-size: 40rpx;
		color: #3D3D3D;
		font-weight: 600;
	}
	.mian-text{
		font-size: 28rpx;
		color: #3D3D3D;
		font-weight: 400;
	}
	.text-title{
		display: block;
		margin-bottom: 20rpx;
	}
	.question_item{
		margin-bottom: 40rpx;
		.text-question{
			display: block;
			margin-bottom: 5rpx;
		}
		.text-answer{
			display: block;
			font-weight: 700;
			margin-bottom: 4rpx;
		}
	}
	
</style>
