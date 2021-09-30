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
				<view class="middle">回收车</view>
				<view class="right" >
					<!-- <image src="../../static/order/shaixuan.png" mode="aspectFill"></image> -->
				</view>
			</view>
		</view>
		<view class="re_list">
			<view class="re_item" v-for="(item, index) in orderData" :key="index" @click="checkboxChange">
					<u-checkbox  v-model="item.checked" shape="circle" active-color='#f7a300' :name="item.id"></u-checkbox>
					<view class="re_box" @click.stop="ToDetail()">
						<view class="re_icon">
							<image class="re_img" :src="item.icon" mode="aspectFill"></image>
						</view>
						<view class="re_desc">
							<text class="desc_top">{{item.goods_classify + '/' +item.type}}</text>
							<text class="desc_bot">{{item.labels}}</text>
						</view>
					</view>
			</view>
		</view>
		<view class="empty-view" v-if="IsEmpty">
			<view class="imgbox">
				<image class="emptyImg" src="../../static/order/empty.png" mode="aspectFill"></image>
			</view>
			<view class="empty-text">
				空空如也~
			</view>
		</view>
		<view class="bot_bar" v-if="orderData.length >0">
			<view class="bar_left">
				<view class="check_all">
					<view class="checkbox_view">
						<u-checkbox class="checkbox" @change="checkedAll()" shape="circle" active-color='#f7a300' v-model="Allchecked"><text class="check_text">全选</text> </u-checkbox>
					</view>
				</view>
				<view class="delect" @click="deleteChoose()">
					删除
				</view>
			</view>
			<view class="bar_right" @click="toAppointment">
				<view class="huishou_btn">
					立即回收
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Allchecked:false,
				orderData: [],
				checkedItem:[],  //被选择的选项数据，用于下单
				check_id:[], //被选择的选项数据id,用于删除
				IsEmpty:false, //数据是否为空
			}
		},
		onLoad() {
			this.getCartLists()
		},
		methods: {
			getCartLists(){
				this.$zshs.request('/web/users/recovery-classify',{
					mode: "getOrderRecyclingCart",
					n: this.$queue.getData('n'),
					user: "common",
					phone_key: this.$queue.getData('clientId'),
				},'POST')
				.then((res)=>{
					console.log(res);
					if(res.code === 200){
						if(res.data.code == 0){
							this.orderData = res.data.recycling_cart
							this.IsEmpty = this.orderData.length > 0 ? false : true
							let datalist = this.orderData
							datalist = res.data.recycling_cart
							// 回收类型数据处理开始
							datalist.map((item, index) => {
								var str1 = item.goods_sub_labels.split(';');
								var str2 = str1[0].split(':')
								item.type = str2[1]
								console.log(str1)
								// item.name = index
								item.checked = false
							})
							// 回收类型数据处理开始
							
							// 使用情况数据处理开始
							let array = ''
							datalist.map((item, index) => {
								var str = item.goods_sub_labels.split(';');
								let str4 = ''
								let newlist = []
								let newString = ''
								str.map((s_item, s_index) => {
									var str3 = s_item.split(':')
									str4 += str3 + ','
									array = str4.substr(0, str4.length - 1).split(',')
									array.map((item, index) => {
										if (index % 2 !== 0) {
											newlist.push(item)
										}
									})
									newlist = newlist.slice(1) //移除数组第一个元素
									// console.log(newlist); //["美的"] 
									newlist.map((item, index) => {
										newString = item + ';'
									})
									newString = newString.substr(0, newString.length -1) //去掉最后一项的';'
									// console.log(newString);  //美的
									item.labels = newString
								})
							})
							// console.log(array); //["类型", "滚筒洗衣机", "品牌", "美的"]
							console.log(this.orderData, '最终'); //最终得到的数据结构
							// 使用情况数据处理结束
						}
					}
				})
			},
			back(){
				uni.navigateBack({})
			},
			ToDetail(){
				// this.$queue.navTo('/pages/createdOrder/usage')
			},
			toAppointment(){
				console.log(this.checkedItem.length);
				if(this.checkedItem.length === 0){
					this.$queue.showToast('请选择你要回收的物品')
					return;
				}
				this.$queue.setData('cartData',this.checkedItem)
				this.$queue.setData('delectId',this.check_id)
				this.$queue.navTo('/pages/createdOrder/appointment?prepages=1')
			},
			checkboxChange() {
				let that = this
				let checkedNum = 0
				let temp = []
				let idList = []
				console.log(that.orderData);
				this.$forceUpdate()
				for(let i=0; i<that.orderData.length; i++ ){
					if(that.orderData[i].checked){	
						checkedNum = checkedNum + 1
						let obj = {
							goods_classify:that.orderData[i].goods_classify,  //回收类别
							goods_sub_labels:that.orderData[i].goods_sub_labels //使用情况
						}
						idList.push(that.orderData[i].id)
						temp.push(obj)
						this.check_id =idList
						this.checkedItem = temp
						
						that.Allchecked = that.orderData.length === checkedNum ? true : false ;
					}
				}
				console.log(temp);//已选择的回收车各项数据
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				console.log(e);
			},
			// 全选
			checkedAll() {
				let that = this
				console.log(that.Allchecked);
				that.Allchecked = that.Allchecked ? false : true
				if(that.Allchecked){
					that.orderData.map(val => {
						val.checked = true;
						
					})
					let checkedNum = 0
					let temp = []
					let idList = []
					for(let i=0; i<that.orderData.length; i++ ){
						if(that.orderData[i].checked){	
							checkedNum = checkedNum + 1
							let obj = {
								goods_classify:that.orderData[i].goods_classify,  //回收类别
								goods_sub_labels:that.orderData[i].goods_sub_labels //使用情况
							}
							idList.push(that.orderData[i].id)
							temp.push(obj)
							this.check_id =idList
							this.checkedItem = temp
						}
					}
					console.log(temp);
				}else{
					that.orderData.map(val => {
						val.checked = false;
					})
					this.checkedItem=[]
					this.check_id =[]
				}
				
			},
			deleteChoose(){
				if(this.checkedItem.length === 0){
					this.$queue.showToast('请选择你所要删除的物品')
					return;
				}
				let that = this
				uni.showModal({
					title:'',
					content:"是否删除所选物品",
					confirmColor:'#F7A300',
					success: function (res) {
					        if (res.confirm) {
					            console.log('用户点击确定');
								that.$zshs.request('/web/users/recovery-classify',{
									mode:'delOrderRecyclingCart',
									user:'common',
									n:that.$queue.getData('n'),
									del_ids:JSON.stringify(that.check_id)      //后台需要数组转JSON字符串
								},'POST')
								.then((res)=>{
									console.log(res);
									if(res.code == 200){
										if(res.data.code ==0){
											that.$queue.showToast('删除成功！')
										}
									}
								})
								
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100vw;
		height: calc(100vh - 44px);
		background-color: #f5f5f5;
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
	
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	.re_list {
		width: 100vw;
		background-color: #FFFFFF;
		margin-top: 100rpx;
		/*#ifdef APP-PLUS*/
		margin-top: 160rpx;
		/*#endif*/
		.re_item {
			width: 100vw;
			height: 160rpx;
			display: flex;
			align-items: center;
			padding: 32rpx;
			.re_box{
				display: flex;
				.re_icon{
					width: 96rpx;
					height: 96rpx;
					background-color: #f5f5f5;
					margin-right: 32rpx;
					line-height: 96rpx;
					border: 2rpx solid #c6c6c6;
					border-radius: 8rpx;
					.re_img{
						width: 100%;
						height: 100%
						;
					}
				}
				.re_desc{
					display: flex;
					flex-direction: column;
					width: 500rpx;
					.desc_top{
						font-size: 28rpx;
						color: #3D3D3D;
						font-weight: 500;
						margin-bottom: 8rpx;
					}
					.desc_bot{
						font-size: 24rpx;
						color: #999999;
						font-weight: 400;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
				}
			}
		}
	}
	.empty-view{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height:100vh;
		.imgbox{
			width: 300rpx;
			height: 400rpx;
			.emptyImg{
				width: 100%;
				height: 100%;
			}
		}
		.empty-text{
			margin-top: 10rpx;
			color: #d9dbdd;
		}
	}
	.bot_bar{
		
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100vw;
		display: flex;
		justify-content: space-between;
		padding: 32rpx;
		background-color: #FFFFFF;
		.bar_left{
			display: flex;
			align-items: center;
			.check_all{
				.checkbox_view{
					margin-right: 24rpx;
				}
			}
			.delect{
				font-size: 28rpx;
				color: #F76675;
				font-weight: 400;
			}
		}
		.check_text{
			font-size: 28rpx;
			color: #3D3D3D;
			font-weight: 400;
			margin-left: 18rpx;
		}
		.bar_right{
			.huishou_btn{
				width: 172rpx;
				height: 64rpx;
				background: #FFD426;
				border-radius: 32rpx;
				font-weight: 400;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style>
