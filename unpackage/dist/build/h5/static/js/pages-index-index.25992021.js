(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-index-index"],{"11cf":function(i,t,e){"use strict";(function(i){e("acd8"),e("ac1f"),e("1276"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;e("029c");var a={data:function(){return{distouch:!1,indicatorDots:!0,autoplay:!0,interval:3e3,duration:500,district:"正在获取定位",params:{province:!0,city:!0,area:!0},imgList:["../../static/swiper.png"],cartNumber:0}},onLoad:function(){this.imgList.length<=1&&(this.distouch=!0),this.$queue.getData("pickerPosition")?(i("log","手动选择定位"," at pages/index/index.vue:160"),this.district=this.$queue.getData("pickerPosition").area):setTimeout((function(){uni.navigateTo({url:"/pages/areaPicker/areaPicker"})}),1500)},onShow:function(){this.$queue.getData("pickerPosition")&&(this.district=this.$queue.getData("pickerPosition").area),this.$queue.getData("isLogin")&&this.getCartNumber()},onHide:function(){uni.setStorageSync("nofirstOpen",!0)},onPullDownRefresh:function(){uni.stopPullDownRefresh()},methods:{getUserPosition:function(){var t=this;uni.getLocation({type:"wgs84",geocode:!0,success:function(e){i("log",e,"获取定位成功"," at pages/index/index.vue:277");var a={city:"",area:"",latitude:e.latitude,longitude:e.longitude};t.district="选择区县",uni.setStorageSync("positionStorage",a)},fail:function(e){i("log",e," at pages/index/index.vue:308"),t.district="获取定位失败,请手动选择定位",setTimeout((function(){uni.navigateTo({url:"/pages/areaPicker/areaPicker"})}),1e3)}})},getCartNumber:function(){var t=this;this.$zshs.request("/web/users/recovery-classify",{mode:"getOrderRecyclingCart",n:this.$queue.getData("n"),user:"common",phone_key:this.$queue.getData("clientId")},"POST").then((function(e){i("log",e," at pages/index/index.vue:326"),t.cartNumber=e.data.recycling_cart.length}))},confirm:function(t){i("log",t," at pages/index/index.vue:331"),this.district=t.area.label},cancel:function(){this.$queue.showToast("定位失败，请选择一个城市")},toPicker:function(){uni.navigateTo({url:"/pages/areaPicker/areaPicker"})},bindDateChange:function(t){this.district=this.areaList[t[1]].label;var e=this.areaList[t[1]].coordinate,a=parseFloat(e.split(",")[0]),s=parseFloat(e.split(",")[1]);i("log",a," at pages/index/index.vue:349"),i("log",s," at pages/index/index.vue:350");var o={district:this.district,latitude:a,longitude:s};uni.setStorageSync("positionStorage",o)},kownMore:function(i){uni.navigateTo({url:i})},toRrcycle:function(i){this.$queue.navTo(i)},navTo:function(i){this.$queue.getData("isLogin")?this.$queue.navTo(i):this.$queue.navTo("/pages/public/login")}}};t.default=a}).call(this,e("0de9")["log"])},"21b6":function(i,t,e){var a=e("7786");"string"===typeof a&&(a=[[i.i,a,""]]),a.locals&&(i.exports=a.locals);var s=e("4f06").default;s("5a6e9eb7",a,!0,{sourceMap:!1,shadowMode:!1})},"2c4f":function(i,t,e){i.exports=e.p+"static/img/huishouche.2f157f36.png"},"4ad8":function(i,t){i.exports="data:image/png;base64,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"},"644d":function(i,t){i.exports="data:image/png;base64,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"},"70d2":function(i,t,e){i.exports=e.p+"static/img/dinwei.55b36571.png"},7786:function(i,t,e){var a=e("24fb");t=a(!1),t.push([i.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* uni.scss */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.content[data-v-a3527c34]{height:calc(100vh- 44px);overflow:hidden}.fixed_view[data-v-a3527c34]{width:100vw;position:fixed;top:0;z-index:999}.fixed_view .top_header[data-v-a3527c34]{height:%?88?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;padding:0 %?32?%;background-color:#ffd426}.fixed_view .top_header .adress_position[data-v-a3527c34]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;height:%?60?%}.fixed_view .top_header .adress_position .position_icon[data-v-a3527c34]{width:%?32?%;height:%?32?%;margin-right:%?8?%}.fixed_view .top_header .adress_position .adress_text[data-v-a3527c34]{font-size:%?26?%;color:#3d3d3d;font-weight:400}.fixed_view .top_header .cart_img[data-v-a3527c34]{position:relative}.fixed_view .top_header .cart_img .cart_icon[data-v-a3527c34]{width:%?40?%;height:%?40?%}.fixed_view .top_header .cart_img .red_number[data-v-a3527c34]{min-width:%?30?%;height:%?30?%;text-align:center;font-size:%?24?%;line-height:%?30?%;border-radius:%?24?%;color:#fff;background:#f76675;display:inline-block;position:absolute;top:%?-8?%;right:%?-8?%}.top_view[data-v-a3527c34]{width:100%;background-color:#ffd426;opacity:1;margin-top:%?88?%}.top_view .swiper_view[data-v-a3527c34]{width:100vw;height:%?800?%}.top_view .swiper_view .swiper[data-v-a3527c34]{width:100%;height:100%}.top_view .swiper_view .swiper .swiper-item[data-v-a3527c34]{width:100%;height:100%}.top_view .swiper_view .swiper .swiper-item uni-image[data-v-a3527c34]{width:100%;height:100%}.top_view[data-v-a3527c34] .uni-swiper-dots-horizontal{bottom:25%}.bot_bg[data-v-a3527c34]{width:100vw;background-color:#f5f5f5;overflow:hidden;padding:0 %?20?%}.bot_bg .platform[data-v-a3527c34]{width:100%;height:%?384?%;margin:0 auto;margin-top:%?180?%;background:#fff;border-radius:%?24?%;padding:%?40?%}.bot_bg .platform .platform_title[data-v-a3527c34]{width:100%;height:%?44?%;font-family:PingFangSC-Medium;font-size:%?32?%;color:#3d3d3d;font-weight:500;margin-bottom:%?10?%}.bot_bg .platform .platform_content[data-v-a3527c34]{width:100%;height:%?34?%;font-family:PingFangSC-Regular;font-size:%?24?%;color:#646464;font-weight:400;margin-bottom:%?40?%}.bot_bg .platform .platform_Img[data-v-a3527c34]{width:100%;height:%?200?%;border-radius:%?12?%;overflow:hidden}.bot_bg .platform .platform_Img uni-image[data-v-a3527c34]{width:100%;height:100%}.bot_bg .problem_view[data-v-a3527c34]{width:100%;min-height:%?740?%;margin:%?30?% auto;background:#fff;border-radius:%?24?%;padding:%?20?% %?30?%}.bot_bg .problem_view .pro_title[data-v-a3527c34]{width:%?128?%;height:%?44?%;font-family:PingFangSC-Medium;font-size:%?32?%;color:#343434;text-align:left;font-weight:700}.bot_bg .problem_view .pro_box[data-v-a3527c34]{width:100%;margin:%?40?% 0;text-align:left}.bot_bg .problem_view .pro_box .pro_question[data-v-a3527c34]{width:100%;min-height:%?34?%;font-family:PingFangSC-Semibold;font-size:%?24?%;color:#3d3d3d;font-weight:700}.bot_bg .problem_view .pro_box .pro_answer[data-v-a3527c34]{width:%?654?%;min-height:%?34?%;font-family:PingFangSC-Regular;font-size:%?24?%;color:#646464;font-weight:400}.bot_bg .problem_view .knowmore[data-v-a3527c34]{width:100%;margin:0 auto;text-align:center}.bot_bg .problem_view .knowmore .more[data-v-a3527c34]{width:%?144?%;height:%?34?%;margin-top:%?20?%;font-family:PingFangSC-Regular;font-size:%?24?%;color:#f7a300;font-weight:400}.bot_view[data-v-a3527c34]{width:100vw;position:absolute;top:%?720?%}.bot_view .subscribe_view[data-v-a3527c34]{width:95.7%;height:%?314?%;background:#fff;border-radius:%?24?%;margin:0 auto;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.bot_view .subscribe_view .subscribe_button[data-v-a3527c34]{width:87.2%;height:%?88?%;background:#ffd426;background-image:-webkit-gradient(linear,left top,left bottom,from(hsla(0,0%,100%,.12)),to(#f7a300));background-image:-webkit-linear-gradient(top,hsla(0,0%,100%,.12),#f7a300);background-image:linear-gradient(180deg,hsla(0,0%,100%,.12),#f7a300);border-radius:%?44?%;text-align:center;line-height:%?88?%;color:#3d3d3d;font-weight:700;font-size:%?32?%}.bot_view .subscribe_view .process[data-v-a3527c34]{width:73.6%;margin-top:%?32?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between}.bot_view .subscribe_view .process .process-item[data-v-a3527c34]{width:12.8%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.bot_view .subscribe_view .process .process-item .process_img .process_icon[data-v-a3527c34]{width:%?56?%;height:%?56?%}.bot_view .subscribe_view .process .process-item .process_img .dian_icon[data-v-a3527c34]{width:%?32?%;height:%?32?%}.bot_view .subscribe_view .process .process-item .process_des[data-v-a3527c34]{height:%?28?%;font-family:PingFangSC-Regular;font-size:%?24?%;color:#646464;white-space:nowrap}',""]),i.exports=t},9046:function(i,t,e){i.exports=e.p+"static/img/shangmen.bf997004.png"},a0a9:function(i,t,e){"use strict";e.r(t);var a=e("11cf"),s=e.n(a);for(var o in a)"default"!==o&&function(i){e.d(t,i,(function(){return a[i]}))}(o);t["default"]=s.a},bb02:function(i,t,e){i.exports=e.p+"static/img/company.3b71ab2b.png"},d2dd:function(i,t){i.exports="data:image/png;base64,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"},e67f:function(i,t,e){"use strict";var a;e.d(t,"b",(function(){return s})),e.d(t,"c",(function(){return o})),e.d(t,"a",(function(){return a}));var s=function(){var i=this,t=i.$createElement,a=i._self._c||t;return a("v-uni-view",{staticClass:"content"},[a("v-uni-view",{staticClass:"fixed_view"},[a("v-uni-view",{staticClass:"empty_view"}),a("v-uni-view",{staticClass:"top_header"},[a("v-uni-view",{staticClass:"adress_position",on:{click:function(t){arguments[0]=t=i.$handleEvent(t),i.toPicker.apply(void 0,arguments)}}},[a("v-uni-image",{staticClass:"position_icon",attrs:{src:e("70d2"),mode:"aspectFill"}}),a("v-uni-view",{staticClass:"adress_text"},[i._v(i._s(i.district))])],1),a("v-uni-view",{staticClass:"cart_img",on:{click:function(t){arguments[0]=t=i.$handleEvent(t),i.navTo("/pages/cart/cart")}}},[a("v-uni-image",{staticClass:"cart_icon",attrs:{src:e("2c4f"),mode:"aspectFill"}}),i.cartNumber>0?a("v-uni-view",{staticClass:"red_number"},[i._v(i._s(i.cartNumber))]):i._e()],1)],1)],1),a("v-uni-view",{staticClass:"top_view"},[a("v-uni-view",{staticClass:"swiper_view"},[a("v-uni-swiper",{staticClass:"swiper",attrs:{"indicator-dots":i.indicatorDots,autoplay:i.autoplay,interval:i.interval,"disable-touch":i.distouch,duration:i.duration}},i._l(i.imgList,(function(t,e){return a("v-uni-swiper-item",{key:e,on:{click:function(t){t.stopPropagation(),arguments[0]=t=i.$handleEvent(t),i.previewImg(e)}}},[a("v-uni-view",{staticClass:"swiper-item"},[a("v-uni-image",{attrs:{src:t,mode:"aspectFill"}})],1)],1)})),1)],1)],1),a("v-uni-view",{staticClass:"bot_bg"},[a("v-uni-view",{staticClass:"platform"},[a("v-uni-view",{staticClass:"platform_title"},[i._v("互联网家电回收行业开拓者")]),a("v-uni-view",{staticClass:"platform_content"},[i._v("本地最专业的线上家电回收综合服务平台")]),a("v-uni-view",{staticClass:"platform_Img"},[a("v-uni-image",{attrs:{src:e("bb02"),mode:"aspectFill"}})],1)],1),a("v-uni-view",{staticClass:"problem_view"},[a("v-uni-view",{staticClass:"pro_title"},[i._v("常见问题")]),a("v-uni-view",{staticClass:"pro_box"},[a("v-uni-view",{staticClass:"pro_question"},[i._v("Q：家电回收的服务流程是什么？")]),a("v-uni-view",{staticClass:"pro_answer"},[i._v("A：您可以通过线上下单，回收员接单后联系您预约上门检测回收，确认回收后现场支付回收款。")])],1),a("v-uni-view",{staticClass:"pro_box"},[a("v-uni-view",{staticClass:"pro_question"},[i._v("Q：上门回收是否安全？")]),a("v-uni-view",{staticClass:"pro_answer"},[i._v("A：线上接单回收商经过回收猿官方企业认证，上门回收员也需经过实名认证，可靠安全。")])],1),a("v-uni-view",{staticClass:"pro_box"},[a("v-uni-view",{staticClass:"pro_question"},[i._v("Q：旧电器被回收后，里面的个人隐私会不会泄露？")]),a("v-uni-view",{staticClass:"pro_answer"},[i._v("A：回收商已经过平台严格的资质审核，并在约定的时间上门回收。")])],1),a("v-uni-view",{staticClass:"pro_box"},[a("v-uni-view",{staticClass:"pro_question"},[i._v("Q：旧电器回收价格是怎么定的？")]),a("v-uni-view",{staticClass:"pro_answer"},[i._v("A：回收价格受市场行情、电器新旧程度、使用情况等因素影响，需由回收员现场估价。若回收价过低，您有权取消回收。")])],1),a("v-uni-view",{staticClass:"pro_box"},[a("v-uni-view",{staticClass:"pro_question"},[i._v("Q：你们收的旧电器去哪了？")]),a("v-uni-view",{staticClass:"pro_answer"},[i._v("A：成色较新的电器在正规的二手渠道中售卖或慈善捐赠，成色较差或功能残缺的电器进行环保拆解回收。")])],1),a("v-uni-view",{staticClass:"knowmore"},[a("v-uni-text",{staticClass:"more",on:{click:function(t){arguments[0]=t=i.$handleEvent(t),i.kownMore("/pages/article_page/knownMore")}}},[i._v("了解更多问题")])],1)],1)],1),a("v-uni-view",{staticClass:"bot_view"},[a("v-uni-view",{staticClass:"subscribe_view"},[a("v-uni-view",{staticClass:"subscribe_button",on:{click:function(t){arguments[0]=t=i.$handleEvent(t),i.toRrcycle("/pages/createdOrder/chooseType")}}},[i._v("预约回收")]),a("v-uni-view",{staticClass:"process"},[a("v-uni-view",{staticClass:"process-item"},[a("v-uni-view",{staticClass:"process_img"},[a("v-uni-image",{staticClass:"process_icon",attrs:{src:e("4ad8"),mode:"aspectFill"}})],1),a("v-uni-view",{staticClass:"process_des"},[i._v("线上下单")])],1),a("v-uni-view",{staticClass:"process-item"},[a("v-uni-view",{staticClass:"process_img"},[a("v-uni-image",{staticClass:"dian_icon",attrs:{src:e("d2dd"),mode:"aspectFill"}})],1)],1),a("v-uni-view",{staticClass:"process-item"},[a("v-uni-view",{staticClass:"process_img"},[a("v-uni-image",{staticClass:"process_icon",attrs:{src:e("9046"),mode:"aspectFill"}})],1),a("v-uni-view",{staticClass:"process_des"},[i._v("上门服务")])],1),a("v-uni-view",{staticClass:"process-item"},[a("v-uni-view",{staticClass:"process_img"},[a("v-uni-image",{staticClass:"dian_icon",attrs:{src:e("d2dd"),mode:"aspectFill"}})],1)],1),a("v-uni-view",{staticClass:"process-item"},[a("v-uni-view",{staticClass:"process_img"},[a("v-uni-image",{staticClass:"process_icon",attrs:{src:e("644d"),mode:"aspectFill"}})],1),a("v-uni-view",{staticClass:"process_des"},[i._v("检测回收")])],1),a("v-uni-view",{staticClass:"process-item"},[a("v-uni-view",{staticClass:"process_img"},[a("v-uni-image",{staticClass:"dian_icon",attrs:{src:e("d2dd"),mode:"aspectFill"}})],1)],1),a("v-uni-view",{staticClass:"process-item"},[a("v-uni-view",{staticClass:"process_img"},[a("v-uni-image",{staticClass:"process_icon",attrs:{src:e("4ad8"),mode:"aspectFill"}})],1),a("v-uni-view",{staticClass:"process_des"},[i._v("当面付款")])],1)],1)],1)],1)],1)},o=[]},e6f8:function(i,t,e){"use strict";e.r(t);var a=e("e67f"),s=e("a0a9");for(var o in s)"default"!==o&&function(i){e.d(t,i,(function(){return s[i]}))}(o);e("ed3d");var n,c=e("f0c5"),r=Object(c["a"])(s["default"],a["b"],a["c"],!1,null,"a3527c34",null,!1,a["a"],n);t["default"]=r.exports},ed3d:function(i,t,e){"use strict";var a=e("21b6"),s=e.n(a);s.a}}]);