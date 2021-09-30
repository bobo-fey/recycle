//Vuex

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		isShow: false //加载等待是否显示
	},
	mutations: {
		changshow(isShow){
			state.isShow = true
		}
	}
})

export default store