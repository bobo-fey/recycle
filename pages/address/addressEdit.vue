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
				<view class="middle">地址编辑</view>
				<view class="right" @click="delect()" v-if="a_id">
					<image src="../../static/address/delect.png" mode="aspectFill"></image>
				</view>
				<view class="right" v-else></view>
			</view>
		</view>
		<view class="address-info">
			<view class="info-item">
				<view class="info-title">
					姓名
				</view>
				<view class="info-text">
					<input type="text" v-model="nickName" />
				</view>
			</view>
			<view class="info-item">
				<view class="info-title">
					电话
				</view>
				<view class="info-text">
					<input type="number" maxlength="11" v-model="phoneNumber" />
				</view>
			</view>
			<view class="info-item" @click="showCitySelect()">
				<view class="info-title">
					所在城市
				</view>
				<view class="info-text">
					<view class="area">
						{{city}}
					</view>
					<view class="right-img">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<view class="info-item" @click="showAreaSelect()">
				<view class="info-title">
					所在区域
				</view>
				<view class="info-text">
					<view class="area">
						{{area}}
					</view>
					<view class="right-img">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<!-- <view class="info-item">
				<view class="info-title">
					所在区域
				</view>
				<view class="info-text">
					<view class="area">
						霞山区
					</view>
					<view class="right-img">
						<image src="../../static/user/right.png" mode="aspectFill"></image>
					</view>
				</view>
			</view> -->
			<view class="info-item" style="align-items: flex-start;  ">
				<view class="info-title">
					详细地址
				</view>
				<view class="info-text">
					<textarea v-model="address" placeholder="街道及门牌号" maxlength="40" />
				</view>
			</view>
		</view>
		<view class="default-view">
			<view class="default-btn">
				<view class="default-title">
					设为默认
				</view>
				<view class="default-text">
					<view class="switch">
						<u-switch v-model="checked" size="40" active-color="#3693f6"></u-switch>
					</view>
				</view>
			</view>
		</view>
		<view class="keep-view" @click="keep()">
			<view class="keep-btn">
				保存
			</view>
		</view>
		<view class="modal-view">
			<u-modal v-model="showmodal" :show-title="showTitle" :title="modalTitle" :title-style="titleStyle"
				:confirm-text="confirmText" :show-cancel-button="true" :content="content" @confirm="confirm"
				:confirm-color="confirmColor">
			</u-modal>
		</view>
		<!-- <u-picker mode="region" v-model="cityPickerShow" @confirm="pickerConfirm" :default-region='areaCode'
			cancel-color="#999999" confirm-color="#F7A300"></u-picker> -->
		<view class="select-view">
			<u-select v-model="citySelectShow" @default-value="defaultValue" :list="cityList" @confirm="citySelectConfirm"
				cancel-color="#999999" confirm-color="#F7A300"></u-select>
			<u-select v-model="areaSelectShow" @default-value="defaultValue" :list="areaList" @confirm="areaSelectConfirm"
					cancel-color="#999999" confirm-color="#F7A300"></u-select>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				defaultValue: 0,
				list:[],
				cityList: [
					// {
					// 	value: '1',
					// 	label: '湛江',
					// },
					// {
					// 	value: '2',
					// 	label: '广州',
					// },
					// {
					// 	value: '3',
					// 	label: '深圳',
					// }
				],
				areaList:[{
					value: '1',
					label: '赤坎',
				},
				{
					value: '2',
					label: '霞山',
				},
				{
					value: '3',
					label: '麻章',
				}],
				
				areaCode: ["广东省", "湛江市", "霞山区"],
				province: '广东省',
				city: '请选择',
				area:'请选择',
				address: '',
				citySelectShow: false,
				areaSelectShow:false,
				showmodal: false, //是否显示模态框
				showTitle: false,
				modalTitle: '',
				titleStyle: {
					color: '#3d3d3d'
				},
				content: '确定删除此地址？',
				confirmText: '删除',
				confirmColor: '#F7A300',
				checked: true,
				nickName: '',
				phoneNumber: '',

				pagesForm: '', //上一个页面的标识
				a_id: '',
			}
		},
		watch: {
			checked(val) { //单选开关的触发事件
				console.log(val);
				this.checked = val
			}
		},
		onLoad(options) {
			this.list =this.cityList
			console.log(options)
			if (options.pagesfrom) { // 判断上一个页面， =="1" 为预约服务页面
				// this.pagesForm = this.$zshs.getDAes(options.pagesfrom)
				 this.pagesForm = options.pagesfrom
				console.log(this.pagesForm);
			} else {
				this.pagesForm = ''
			}
			if (options.a_id) { //控制删除按钮编辑时（'edit'）才显示，新建地址不显示
				// this.a_id = this.$zshs.getDAes(options.a_id)
				this.a_id =options.a_id	
				console.log(this.a_id);
			} else {
				this.a_id = '';
			}
		},
		onShow() {
			this.getcityList()
			if(this.a_id){
				console.log(this.a_id)
				this.getAddressDetail()
			}
		},
		methods: {
			getAddressDetail(){
				this.$zshs.request('/web/users/account',{
					id: this.a_id,
					mode: "getOneAddress",
					n: this.$queue.getData('n'),
					phone_key: uni.getStorageSync('clientId'),
					user: "common"
				},'POST')
				.then((res)=>{
					console.log(res);
					this.nickName= res.data.name
					this.phoneNumber= res.data.phone_no
					this.province = res.data.province
					this.city = res.data.city
					this.area = res.data.district
					this.address = res.data.address
					// this.cityname = this.province + this.city+ this.area
					// this.areaCode = [ this.province,this.city,this.area]
					this.checked = res.data.is_first == 1 ? true : false
				})
			},
			showCitySelect() { //城市选择器
				this.citySelectShow = true
			},
			showAreaSelect(){
				if(this.city == '请选择'){
					this.$queue.showToast('请先选择城市')
					return;
				}else{
					this.areaSelectShow = true
				}
			},
			citySelectConfirm(e) {
				console.log(e);
				if(this.city == '请选择'){
					this.city = e[0].label
					this.getAreaList(e[0].label)
				}else{
					this.getAreaList(e[0].label)
					if(this.city !== e[0].label){
						this.city = e[0].label
						this.area ='请选择'
					}
				}
				
			},
			areaSelectConfirm(e) {
				console.log(e);
				this.area = e[0].label
			},
			keep() {
				if (!this.nickName) {
					this.$queue.showToast('请填写姓名')
					return;
				}
				if (this.phoneNumber) { //手机号码校验
					console.log(this.phoneNumber)
					var myreg = /^1[3-9]\d{9}$/;
					if (!myreg.test(this.phoneNumber)) {
						this.$queue.showToast('请输入正确的手机号码！')
						return;
					}
				} else {
					this.$queue.showToast('请输入手机号码！')
					return;
				}
				// if (!this.province || !this.city || !this.area) {
				// 	this.$queue.showToast('请选择您所在的省市区')
				// 	return;
				// }
				if (this.city == '请选择') {
					this.$queue.showToast('请选择您所在的城市')
					return;
				}
				if (this.area == '请选择') {
					this.$queue.showToast('请选择您所在城市的区县')
					return;
				}
				if (!this.address) {
					this.$queue.showToast('请选择您所在的详细地址')
					return;
				}
				let isFrist = this.checked ? 1 : 0
				console.log(isFrist);
				let n_id = this.$queue.getData('n')
				let c_key = uni.getStorageSync('clientId')
				let temp1 = {
					action: "add",
					mode: "setAddress",
					user: "common",
					is_first: isFrist,
					n: n_id,
					name: this.nickName,
					phone_key: c_key,
					phone_no: this.phoneNumber,
					province: this.province,
					city: this.city,
					district: this.area,
					address: this.address,
				}
				let temp2 = {
					action: "edit",
					mode: "setAddress",
					user: "common",
					is_first: isFrist,
					n: n_id,
					address_id:this.a_id,
					name: this.nickName,
					phone_key: c_key,
					phone_no: this.phoneNumber,
					province: this.province,
					city: this.city,
					district: this.area,
					address: this.address,
				}
				let data = this.a_id ? temp2 : temp1  // temp2编辑 temp1保存
				this.$zshs.request('/web/users/account', data, 'POST')
					.then((res) => {
						console.log(res);
						if (this.pagesForm == '1') { //上个页面为预约服务， 使用页面栈改变上一个页面的data数据再navback，实现navback携带参数返回
							let temp2 = { //需要返回上一个页面的参数
								name: this.nickName,
								phone_no: this.phoneNumber,
								province: this.province,
								city: this.city,
								district: this.area,
								address: this.address,
								id: res.data.id
							}
							let pages = getCurrentPages(); //获取所有页面栈实例列表
							let nowPage = pages[pages.length - 1]; //当前页页面实例
							let prevPage = pages[pages.length - 2]; //上一页页面实例
							prevPage.$vm.beforePageData = temp2; //修改上一页data里面的searchVal参数值为1211
							uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
								delta: 1,
							})
						} else {
							uni.navigateBack({})
						}
						// let AESdata= this.$zshs.getAES(JSON.stringify(temp2))//测试数据加密路由传参
						// console.log(AESdata)
						// this.pagesForm == '1' ? uni.redirectTo({url:'/pages/createdOrder/appointment?data=' + AESdata}) : uni.navigateBack({})
					})


			},
			delect() {
				this.showmodal = true
			},
			back() {
				uni.navigateBack({})
			},
			// showPicker() {
			// 	this.isShow = true
			// },
			confirm() {
				console.log(321);
				let isFrist2 = this.checked ? 1 : 0
				let n_id2 = this.$queue.getData('n')
				let c_key2 = uni.getStorageSync('clientId')
				this.$zshs.request('/web/users/account', {
					action: "del",
					address_id: this.a_id,
					mode: "setAddress",
					n:n_id2,
					phone_key: c_key2,
					user: "common"
				}, 'POST')
					.then((res)=>{
						console.log(res);
						 uni.removeStorageSync('addressStorage');
						uni.navigateBack({})
					})
			},
			getcityList(){
				this.$zshs.request('/web/users/recovery-classify',{
					mode: 'getLocation',
					user : 'common',
					action:'getCity',
					province:'广东'
				},'POST')
					.then(res=>{
						console.log(res);
						if(res.code ==200){
							if(res.data.code ==0){
								this.cityList =res.data.cities
							}
						}
					})
			},
			getAreaList(temp){
				console.log('11111111111');
				this.$zshs.request('/web/users/recovery-classify',{
					mode: 'getLocation',
					user : 'common',
					action:'getCounty',
					city:temp
				},'POST')
					.then(res=>{
						console.log(res);
						if(res.code ==200){
							if(res.data.code ==0){
								this.areaList =res.data.counties
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
		height: 100vh;
		background-color: #F5F5F5;
		overflow: hidden;
	}

	.title-bar {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
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

	.address-info {
		// height: 200rpx;
		width: 100vw;
		padding: 0 32rpx;
		background-color: #fff;
		margin-top: 120rpx;
		/*#ifdef APP-PLUS*/
		margin-top: 180rpx;

		/*#endif*/
		:nth-last-child(1) {
			border-bottom: 2rpx solid #FFFFFF !important;
		}

		.info-item {
			padding: 24rpx 0;
			border-bottom: 2rpx solid #F4F4F4;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.info-title {
				font-size: 28rpx;
				color: #646464;
				font-weight: 400;
			}

			.info-text {
				display: flex;

				input {
					width: 500rpx;
					font-size: 28rpx;
					color: #3D3D3D;
					text-align: right;
					font-weight: 400;
				}

				.area {
					font-size: 28rpx;
					color: #3D3D3D;
					text-align: right;
					font-weight: 400;
				}

				.right-img {
					width: 24rpx;
					height: 24rpx;
					margin-left: 16rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				/deep/uni-textarea {
					width: 520rpx !important;
					max-height: 112rpx;
					text-align: right;
					font-size: 28rpx;
					color: #3D3D3D;
				}

				.switch {
					// width: 96rpx;
					// height: 48rpx;
				}

			}
		}
	}

	.default-view {
		width: 100vw;
		padding: 0 32rpx;
		background-color: #FFFFFF;
		margin-top: 32rpx;
		margin-bottom: 64rpx;

		.default-btn {
			padding: 24rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.default-title {
				font-size: 28rpx;
				color: #646464;
				font-weight: 400;
			}

			.default-text {
				display: flex;
				align-items: center;
				.switch {
					display: flex;
					align-items: center;
				}

			}
		}
	}

	.keep-view {
		width: 100vw;
		padding: 0 32rpx;

		.keep-btn {
			width: 100%;
			height: 88rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			color: #3D3D3D;
			font-weight: 400;
			background-color: #FFD426;
			border-radius: 44rpx;
		}
	}
</style>
