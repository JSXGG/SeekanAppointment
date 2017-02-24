Page({
    data: {
        items: [],
        userInfo: {}
    },
    onLoad: function (options) {
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
        var that = this;
        getApp().getUserInfo(function (info) {
            that.setData({
                userInfo: info
            })
        });
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    clickOntheitem: function () {
        //点击列表事件。
        wx.navigateTo({
            url: '../appointment/appointment'
        })
    },
    clickOntheserve: function () {
        wx.navigateTo({
            url: '../myserve/myserve'
        })
    }
})