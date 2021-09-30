<template>
	<view class="content">
		<view class="back-btn" @click="navBack">
			<image src="../../static/left_btn.png" mode="aspectFill"></image>
		</view>
		<view class="usage-view">
			电器使用情况
		</view>
		<view class="parameter-view">
			<view class="parameter-item" v-for="(item,index) in usageList" v-if="usageList.length>0" :key="index">
				<view class="parameter-name" v-if="item.child.length > 0">
					{{item.type}}
				</view>
				<view class="parameter-child">
					<view class="child-item" :class="c_item.select ? 'active' : ''"
						v-for="(c_item,c_index) in item.child" :key="c_index" @click="selectItem(index,c_index)">
						{{c_item.label}}
					</view>
				</view>
			</view>
		</view>
		<view class="next-btn" @click="navTo">
			<text class="next-text">下一步</text>
			<view class="keep-view" @click.stop="addCart()">
				<view class="cart_img">
					<image src="../../static/huishouche.png" mode="aspectFill"></image>
				</view>
				<text class="kepp-text">保存</text>
			</view>
		</view>

		<view class="guide" @touchmove.stop.prevent="moveHandle" v-if="showGuide">
			<view class="skip" @click.stop="jump">
				跳过
			</view>
			<view :style="getStyle" class="guide-box" catchtouchmove="true">
				<view class="tips" :style="{left: guideInfo.tipStyle.left,top:guideInfo.tipStyle.top}" v-if="tipsShow" @click="next">
					<!-- <view class="text">新人引导——</view> -->
					<view class="text">{{ guideInfo.tips }}</view>
					<view class="next">
						<text >{{ guideInfo.next }}</text>
					</view>
				</view>
				<view class="arrow"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				usageList: [],
				t_id: 0,
				isTap: false,
				g_width: '',
				g_height: '',
				g_top: '',
				g_left: '',
				showGuide: false,
				tipsShow:true,
				index: 0,
				guideList: [{
					tips: '选择你要回收物品的各项使用情况', // 提示文字
					next: '下一步', // 下一步按钮显示文字
					tipStyle: { // tips样式
						top: '200rpx',
						left: '4rpx'
					}
				}, {
					tips: '点击“保存”按钮，可以创建订单保存至回收车',

					next: '下一步',
					tipStyle: {
						top: '-170rpx',
						left: '-520rpx'
					}
				}, {
					tips: '‘下一步’，选择服务需求,并提交订单',
					next: '下一步',
					tipStyle: {
						top: '-170rpx',
						left: '30rpx'
					}
				}]
			}
		},
		computed: {
			guideInfo() {
				return this.guideList[this.index];
			},
			getStyle() {
				return {
					width: this.g_width + 'px',
					height: this.g_height + 'px',
					left: this.g_left + 'px',
					top: this.g_top + 'px',
					bottom: this.g_bot + 'px',
					boxShadow: 'rgb(33 33 33 / 80%) 0px 0px 0px 0px, rgb(33 33 33 / 50%) 0px 0px 0px 5000px'
				}
			},

		},
		onLoad(options) {
			if (options.t_id) {
				this.t_id = options.t_id
			}
			this.getUsage() //获取使用情况
		},
		onReady() {
			// if(this.showGuide){
				let _this = this;
				// 计算组件的高度
				let view = uni.createSelectorQuery().select('.parameter-view'); //元素的页面参数
				setTimeout(()=>{
					view.boundingClientRect(data => {
						console.log(data);
						_this.g_width = data.width + 10
						_this.g_height = 80
						_this.g_top = data.top - 5
						_this.g_left = data.left - 5
					}).exec();
				},100)
			// }
		},
		methods: {
			jump(){
				this.$queue.setData('hasGuide',true) //缓存数据，该用户已经经过新手引导
				// setTimeout(()=>{
					uni.redirectTo({
						url:"/pages/createdOrder/chooseType"
					})
				// },1000)
			},
			next() {
				this.g_width = 0
				this.g_height = 0
				this.tipsShow = false
				if (this.index === this.guideList.length - 1) {
					this.showGuide = false;
					uni.redirectTo({
						url:"/pages/createdOrder/appointment"
					})
				} else {
					this.index += 1;
					if (this.index == 1) {
						let _this = this;
						// 计算组件的高度
						let view = uni.createSelectorQuery().select('.keep-view'); //元素的页面参数
						view.boundingClientRect(data => {
							setTimeout(()=>{
								_this.g_width = data.width + 10
								_this.g_height = data.height
								_this.g_top = data.top
								_this.g_left = data.left - 5
								_this.tipsShow = true
							},200)
						}).exec();
					} else {
						let _this = this;
						// 		// 计算组件的高度
						let view1 = uni.createSelectorQuery().select('.next-btn'); //元素的页面参数
						view1.boundingClientRect(data => {
							// console.log(data);
							_this.g_width = data.width
							_this.g_height = 70
							_this.g_top = data.top
							_this.g_left = data.left
							_this.tipsShow = true
						}).exec();
					}
				}

			},
			moveHandle() {
				return false;
			},
			getUsage() { //获取数据列表
				uni.showLoading()
				this.$zshs.request('/web/users/recovery-classify', {
						mode: 'getClassify_usage',
						user: 'common',
						m_id: this.t_id,
					}, 'POST')
					.then((res) => {
						console.log(res)
						uni.hideLoading()
						if (res.code === 200) {
							this.usageList = res.data
							// #ifdef APP-PLUS
							//步骤引导
							 this.showGuide = this.$queue.getData('hasGuide') ? false : true  //hasGuide为true的时候表示引导过了隐藏引导为false
							// #endif
							console.log(this.usageList)
							let i_type = ''
							this.usageList.map((item, key) => {
								item.child.map((item2, key2) => {
									// if (key2 == 0) {
									// 	i_type += item.type +':'+ item2.label+';'
									// }
									// let temp = i_type.slice(0,i_type.length-1)
									// console.log(temp);
									// this.$queue.setData('goods_sub_labels',temp)  //缓存默认第一项数据
									key2 == 0 ? item2["select"] = true : item2["select"] =
										false //给数组添加select属性，默认第一项选中
								})
							})

						}
					})
			},
			selectItem(index, c_index) {
				this.usageList[index].child.map((item, i) => {
					item.select = i == c_index ? true : false
				})
				console.log(index, c_index)
				this.$forceUpdate()
			},
			addCart() { //添加回收车
				if (!this.$queue.getData('isLogin')) { //登陆拦截
					this.$queue.navTo('/pages/public/login')
					return;
				}
				if (this.isTap) { //禁止多次触发
					this.$queue.showToast('已添加至回收车，请勿重新添加！')
					return;
				}
				let u_type = ''
				this.usageList.map((item, index) => {
					item.child.map((c_item, c_index) => {
						if (c_item.select) {
							u_type += item.type + ':' + c_item.label + ';';
						}
					})
				})
				let usages = u_type.slice(0, u_type.length - 1)
				this.$zshs.request('/web/users/recovery-classify', {
						goods_classify: this.$queue.getData('goods_classify'),
						goods_sub_labels: usages,
						mode: "addOrderRecyclingCart",
						n: this.$queue.getData('n'),
						user: "common",
					}, 'POST')
					.then((res) => {
						console.log(res);
						if (res.code === 200) {
							if (res.data.code == 0) {
								this.isTap = true
								this.$queue.showToast('添加回收车成功！')
							}else{
								this.$queue.showToast('添加回收车失败！')
							}
						}else{
							this.$queue.showToast('服务器错误，请稍后重试')
						}
					})
			},
			navBack() {
				uni.navigateBack({})
			},
			navTo() {
				let i_type = ''
				this.usageList.map((item, index) => {
					item.child.map((c_item, c_index) => {
						if (c_item.select) {
							i_type += item.type + ':' + c_item.label + ';';
						}
					})
				})
				let temp = i_type.slice(0, i_type.length - 1)
				this.$queue.setData('goods_sub_labels', temp)
				this.$queue.navTo('/pages/createdOrder/appointment')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100vw;
		// height: calc(100vh- 44px);
		overflow: hidden;
		padding: 0 32rpx;
	}

	.back-btn {
		position: absolute;
		top: 32rpx;
		left: 48rpx;
		/*#ifdef APP-PLUS*/
		top: 76rpx;
		/*#endif*/
		width: 50rpx;
		height: 50rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.usage-view {
		font-family: PingFangSC-Semibold;
		font-size: 48rpx;
		color: #3D3D3D;
		font-weight: 600;
		margin-top: 168rpx;
		margin-bottom: 72rpx;
	}

	.parameter-view {
		width: 100%;
		padding-bottom: 100rpx;
		.parameter-item {
			margin-bottom: 40rpx;

			.parameter-name {
				font-size: 28rpx;
				color: #3D3D3D;
				font-weight: bold;
				margin-bottom: 32rpx;
			}

			.parameter-child {
				display: flex;
				flex-wrap: wrap;

				.child-item {
					height: 64rpx;
					white-space: nowrap;
					padding: 14rpx 12rpx;
					border: 2rpx solid #cfcfcf;
					border-radius: 4rpx;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					margin-right: 14rpx;
					margin-bottom: 24rpx;
				}

				.active {
					color: #F7A300;
					border: 1rpx solid #F7A300 !important;
				}
			}
		}
	}

	.next-btn {
		width: 100vw;
		height: 98rpx;
		background: #FFD426;
		font-size: 32rpx;
		color: #3D3D3D;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		left: 0;
		bottom: 0;

		.next-text {
			font-size: 32rpx;
			color: #3D3D3D;
			font-weight: bold;
		}

		.keep-view {
			height: 98rpx;
			position: fixed;
			bottom: 0rpx;
			right: 40rpx;
			display: flex;
			align-items: center;

			.cart_img {
				width: 32rpx;
				height: 32rpx;
				margin-right: 8rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.kepp-text {
				font-size: 28rpx;
				color: #3D3D3D;
				font-weight: 500;
			}
		}
	}

	.guide {
		position: fixed;
		top: 200rpx;
		left: 200rpx;
		right: 0;
		bottom: 0px;
		z-index: 1000;
		.skip{
			width: 120rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 30rpx;
			background-color: #666;
			color: #FFFFFF;
			font-size: 34rpx;
			font-weight: 700;
			position: absolute;
			top: -100rpx;
			right: 40rpx;
			z-index: 110;
		}
		.guide-box {
			position: fixed;
			z-index: 100;
			// transition: all 0.2s;
			border-radius: 10rpx;
			.arrow {
				height: 40rpx;
				width: 0rpx;
				background: #F7A300;
				position: absolute;
				top: 144rpx;
				left: 50%;
				transform: rotate(45deg);
			}

			.tips {
				background: #F7A300;
				box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.1);
				color: #fff;
				position: absolute;
				top: 270rpx;
				left: -50%;
				padding: 15rpx 20rpx;
				font-size: 30rpx;
				border-radius: 12rpx;

				.text {
					white-space: nowrap;
				}

				.next {
					text-align: right;
					padding-right: 0rpx;
					margin-top: 10rpx;
					// width: 100rpx;
					// height: 50rpx;
					font-size: 32rpx;
					// background-color: #FBC02D;
				}
			}
		}
	}
</style>
