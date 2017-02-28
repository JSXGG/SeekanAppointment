Page({
    data: {
        items: []
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
    },
    onShow: function () {
        // 生命周期函数--监听页面显示 getmyconvention
        var userInfo = getApp().globalData.userInfo;
        this.getmyorder(userInfo.id);
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏
    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
    },
    getmyorder(uid){
        var that = this;
        wx.request({
            url: 'https://xggserve.com/xgg/getmyorder',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                uid: uid
            },
            success: function (res) {
                var items = res.data.data;
                if (items) {
                    that.setData({
                        items: items
                    });
                }
            }
        })
    },
    //点击进入订单详情。
    clickOntheCellitem: function (e) {
        var that = this;
        var item = e.currentTarget.dataset.item;
        wx.showActionSheet({
            itemList: ['接受预约', '拒绝预约'],
            success: function (res) {
                console.log(res.tapIndex)
                if (res.tapIndex == 0) {
                    // that.dealmyorder(item.serveid, true)
                }
                else {
                    // that.dealmyorder(item.serveid, false)
                }
            }
        })
    },
    dealmyorder(serveid, isaccept){
        let ToasTitle = '';
        wx.showToast({
            title: '正在请求',
            icon: 'loading',
            duration: 10000
        })
        var that = this;
        wx.request({
            url: 'https://xggserve.com/xgg/dealmyorder',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                serveid: serveid,
                isaccept:isaccept
            },
            success: function (res){
                wx.hideToast();
                console.log();
            }
        })
    },
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: 'title', // 分享标题
            desc: 'desc', // 分享描述
            path: 'path' // 分享路径
        }
    }
})