Page({
    data: {
        items: [],
        userInfo: {},
        showuserUnlogin: true
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
            if (info.error) {
                that.setData({
                    showuserUnlogin: true
                })
            }
            else {
                that.setData({
                    userInfo: info,
                    showuserUnlogin: false
                })
            }
        });
    },
    clickOntheAboutMe: function () {
        console.log('23123123123');
        wx.miniProgram.navigateTo({url: '/path/to/page'})
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})