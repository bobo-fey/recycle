
module.exports = {
	navTo:function (url){
		uni.navigateTo({
			url:url
		})
	},
    logout() {
        this.remove("token");
        this.remove("userId");
        this.remove("mobile");
        this.remove("openid");
        this.remove("nickName");
        this.remove("relation");
        this.remove("image_url");
        this.remove("relation_id");
    },
    loginClear() {
        this.remove("token");
        this.remove("userId");
        this.remove("mobile");
        this.remove("nickName");
        this.remove("image_url");
        this.remove("relation_id");
    },
    showLoading(title) {
        uni.showLoading({
            title: title
        });
    },
    showToast(title) {
        uni.showToast({
            title: title,
            mask: false,
            duration: 2000,
            icon: "none"
        });
    },
    setData: function (key, value) {
        try {
            uni.setStorageSync(key, value);
        } catch (e) {
            // error
        }
    },
    getData: function (key) {
        try {
            const value = uni.getStorageSync(key);
            if (value) {
                return value;
            }
        } catch (e) {
            // error
        }

    },
    clear: function () {
        uni.clearStorage();
    },
    remove: function (key) { //删除某条队列
        try {
            uni.removeStorageSync(key);
            //localStorage.removeItem(key)
        } catch (e) {
            // error
        }
    },
    getCount: function (key) { //获取队列中全部数据数量

        let data = this.getJson(key);
        if (data instanceof Array) {
            return data.length;
        }
        return 0;
    },
};

