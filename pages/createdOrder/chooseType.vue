<template>
	<view class="content" id='content'>
		<view class="back-btn" @click="navBack">
			<image src="../../static/login/close.png" mode="aspectFill"></image>
		</view>
		<view class="title">
			请选择一个回收类别
		</view>
		<view class="type_view">
			<view class="type_item" :class="currentIndex == index ? 'active' : ''" v-for="(item,index) in typelist"
				:key="index" @click.stop="tap(item,index)">
				<view class="type_img">
					<image :src="item.imgurl" mode="aspectFill"></image>
				</view>
				<view class="type_text">
					{{item.classify_main}}
				</view>
			</view>
			<!-- 占位符 -->
			<view class="type_item2" style="background-color: #fff;" v-if="additem"></view> 
		</view>
		<view class="agreement_view" v-if="typelist.length >0">
			<view class="check_btn">
				<u-checkbox shape="circle" @change="checkboxChange" style="transform:scale(1) " active-color='#f7a300'
					v-model="checked"> </u-checkbox>
			</view>
			<view class="agreement_text">
				我已阅读并同意<navigator class="link" url='/pages/article_page/serviceNotice'>《回收猿回收须知》</navigator>
				中的相关条款，并遵循其中约定。
			</view>
		</view>
		<view class="next-btn" @click="navTo">
			<text>下一步</text>
		</view>

		<view class="guide" @touchmove.stop.prevent="moveHandle" v-if="showGuide">
			<view class="skip" @click="jump">
				跳过
			</view>
			<view :style="getStyle" class="guide-box" catchtouchmove="true">
				<view class="tips" :style="{left: guideInfo.tipStyle.left,top:guideInfo.tipStyle.top}" v-if="tipsShow"  @click="next">
					<!-- <view class="text">新人引导——</view> -->
					<view class="text">{{ guideInfo.tips }}</view>
					<view class="next">
						<text>{{ guideInfo.next }}</text>
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
				additem: false,
				typelist: [],
				currentIndex: 0,
				checked: false,
				typename: '',
				t_id: 0,

				//步骤引导 开始
				showGuide: false,
				tipsShow:true,
				index: 0,
				guideList: [{
					tips: '点击这里，选择你要回收物品的类别', // 提示文字
					next: '下一步', // 下一步按钮显示文字
					tipStyle: { // tips样式
						top: '260rpx',
						left: '4rpx'
					}
				}, {
					tips: '第二步,划到底部，阅读并勾选回收猿回收服务须知',
					next: '下一步',
					tipStyle: {
						top: '-170rpx',
						left: '10rpx'
					}
				}, {
					tips: ' 然后,"点击下一步",回收物品使用情况说明',
					next: '下一步',
					tipStyle: {
						top: '-170rpx',
						left: '24rpx',
					}
				}],
				g_width: '',
				g_height: '',
				g_top: '',
				g_left: '',
				scroll_top:0, //滚动到底部的距离px
				//步骤引导 结束
			}
		},
		computed: {
			//步骤引导 开始
			guideInfo() {
				return this.guideList[this.index];
			},
			getStyle() {
				return {
					width: this.g_width + 'px',
					height: this.g_height + 'px',
					left: this.g_left + 'px',
					top: this.g_top + 'px',
					boxShadow: 'rgb(33 33 33 / 80%) 0px 0px 0px 0px, rgb(33 33 33 / 50%) 0px 0px 0px 5000px'
				}
			},
			//步骤引导 结束
		},
		onLoad() {
			this.getTypeList()
			// this.showGuide = this.$queue.getData('hasGuide') ? false : true  //hasGuide为true的时候表示引导过了隐藏引导为false
		},
		onShow() {
			
		},
		onReady() {
			if(!this.$queue.getData('hasGuide')){
				//步骤引导 开始
				let _this = this
				_this.g_width =0
				_this.g_height =0
				_this.tipsShow =false
				
				let view_item = uni.createSelectorQuery().select('.type_view');  //元素的页面参数
				setTimeout(()=>{
				view_item.boundingClientRect(data => {
					console.log(data);
							_this.g_width = 118
							_this.g_height = 122
							_this.g_top = data.top -5
							_this.g_left = data.left -5
							_this.tipsShow =true
				}).exec();
				},100)
				//步骤引导 结束
			}
			
		},
		onPageScroll(res){
			this.scroll_top = res.scrollTop//距离页面顶部距离
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
			next() {  //步骤引导点击下一步
				this.g_width =0
				this.g_height =0
				this.tipsShow =false
				if (this.index === this.guideList.length - 1) {
					this.showGuide = false;
					uni.redirectTo({
						url:"/pages/createdOrder/usage?t_id=1"
					})
				} else {
					this.index += 1;
					if (this.index == 1) {
						this.$nextTick(() => { // 一定要用nextTick
							uni.pageScrollTo({
								scrollTop: 2000000, //滚动到页面的目标位置（单位px）
								duration: 0 //滚动动画的时长，默认300ms，单位 ms
							});
						}) 
						let _this = this;
						// 计算组件的高度
								let view = uni.createSelectorQuery().select('.agreement_view');  //元素的页面参数
								view.boundingClientRect(data => {
									console.log(data);
									setTimeout(()=>{
										_this.g_width = data.width+10
										_this.g_height =data.height+10
										_this.g_top = data.top-_this.scroll_top -5  //如果屏幕滚动，减去滚动的距离
										_this.g_left =data.left-5 
										_this.tipsShow =true
									},600)
								}).exec();
					} else{
						let _this = this;
								// 计算组件的高度
								let view = uni.createSelectorQuery().select('.next-btn');  //元素的页面参数
								view.boundingClientRect(data => {
									console.log(data);
									_this.g_width = data.width
									_this.g_height = data.height
									_this.g_top = data.top
									_this.g_left = 0
									_this.tipsShow =true
								}).exec();
					}
				}
			},
			moveHandle() {
				return false;
			},
			getTypeList() {
				uni.showLoading()
				this.$zshs.request('/web/users/recovery-classify', {
						mode: 'getMainClassify',
						user: 'common'
					}, 'POST')
					.then((res) => {
						console.log(res)
						if(res.code === 200){
							uni.hideLoading()
							const guide = uni.getStorageSync('guide_key');
							// #ifdef APP-PLUS
							//步骤引导
							 this.showGuide = this.$queue.getData('hasGuide') ? false : true  //hasGuide为true的时候表示引导过了隐藏引导为false
							// #endif
							this.typelist = res.data
							this.typelist.map((item, index) => { //初始化选中项
								if (index == 0) {
									item.checked = true
									this.t_id = item.id
								} else {
									item.checked = false
								}
								item.imgurl = item.checked ? item.icon_sel : item.icon
							})
							this.typename = res.data[0].classify_main //默认选中第一个选项，本地保存数据
							if (this.typelist.length % 9 !== 0 && this.typelist.length % 2 ==
								1) { //控制space-between 中间空一格出来的样式问题 ，在后面添加多一项
								this.additem = true
							}
						}
					})
			},
			tap(item, index) {
				this.currentIndex = index //动态样式变化标识
				this.typename = item.classify_main
				this.typelist.map((t_item, t_index) => {
					if (t_index == index) {
						t_item.checked = true
						this.t_id = t_item.id
					} else {
						t_item.checked = false
					}
					t_item.imgurl = t_item.checked ? t_item.icon_sel : t_item.icon
				})
			},
			checkboxChange(e) {
				this.checked = e.value;
			},
			navBack() {
				uni.navigateBack({})
			},
			navTo() {
				if (this.checked) {
					this.$queue.setData('goods_classify', this.typename) //本地保存回收类型数据
					console.log(this.$queue.getData('goods_classify'));
					this.$queue.navTo("/pages/createdOrder/usage?t_id=" + this.t_id)
				} else {
					this.$queue.showToast('请阅读及同意下方的回收协议')
				}
			}
		},

	}
</script>

<style lang="scss" scoped>
	.content {
		// width: 100vw;
		// min-height: 100vh;
		padding: 48rpx;
		position: relative;
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

	.title {
		margin-top: 136rpx;
		font-size: 40rpx;
		color: #3D3D3D;
		font-weight: 600;
		margin-bottom: 72rpx;
	}

	.type_view {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-bottom: 48rpx;

		.type_item {
			width: calc((100vw - 92rpx - 52rpx)/3);
			height: 216rpx;
			background: #F5F5F5;
			border-radius: 16rpx;
			margin-bottom: 24rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.type_img {
				width: 72rpx;
				height: 72rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		.type_item2 {
			width: calc((100vw - 92rpx - 52rpx)/3);
			height: 216rpx;
			background: #F5F5F5;
			border-radius: 16rpx;
			margin-bottom: 24rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.active {
			color: #F7A300;
			background: #FFFFFF;
			border: 4rpx solid #F7A300 !important;
		}
	}

	.agreement_view {
		display: flex;
		margin-bottom: 98rpx;

		.check_btn {
			display: flex;
			align-items: center;
		}

		.agreement_text {
			font-size: $uni-font-size-sm;

			.link {
				display: inline;
				color: #F7A300;
				text-decoration: underline
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
			box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.1);
			.arrow {
				height: 20rpx;
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
