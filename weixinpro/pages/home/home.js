Page({
    data: {
        items: [],
        currentStoreinfo: {},//当前商店信息。
        showUnserve: false,
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成

    },
    onShow: function () {
        // 生命周期函数--监听页面显示
        this.getconfig();
    },
    //获取配置数据，上次选择的公司是什么。
    getconfig(){
        var that = this;
        getApp().getUserInfo(function (info) {
            if (!info.error) {
                var openid = info['openid'];
                wx.getStorage({
                    key: info['openid'],
                    success: function (res) {
                        that.getServelist('3', res.data['businessid']);
                        that.setData({
                            currentStoreinfo: res.data
                        })
                    },
                    fail: function () {
                        that.templeSelectCominfo();
                    }
                })
            }
            else {
                that.templeSelectCominfo();
            }
        });
    },
    //默认选中的公司
    templeSelectCominfo(){
        this.setData({
            currentStoreinfo: {name: '广州风萧萧信息科技有限公司'}
        })
        this.getServelist('3', '1');
    },
    //获取服务列表
    getServelist(uid, businessid) {
        if (this.data.items.length == 0) {
            wx.showNavigationBarLoading();
        }
        var that = this;
        wx.request({
            url: 'https://xggserve.com/xgg/getservelist',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                uid: uid,
                businessid: businessid
            },
            success: function (res) {
                var list = res.data.data.list;
                var info = res.data.data.info;
                var listinfo = [];
                wx.stopPullDownRefresh();
                wx.hideNavigationBarLoading();
                for (var index in list) {
                    var obj = list[index];
                    obj['icon'] = info['icon'];
                    listinfo.push(obj);
                }
                that.setData({
                    items: listinfo
                });
                wx.hideToast()
            }
        })
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏
    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作
        this.getconfig();
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数

    }
})