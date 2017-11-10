Page({
    data: {
        info: {},
        compinfo: {}
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 20000
        });
        setTimeout(() => {
            this.getserveinfo(options.serveid);
            this.getCompanyinfo(options.businessid);
        }, 1000);
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成

    },
    onShow: function () {
        // 生命周期函数--监听页面显示
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏
    },
    //获取公司的服务信息。
    getserveinfo: function (serveid) {
        var that = this;
        wx.request({
            url: 'https://xggserve.com/xgg/getserveinfo',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'serveid': serveid
            },
            success: function (res) {
                wx.hideToast();
                let info = res.data.data;
                info.btime = info.btime;
                info.etime = info.etime;
                that.setData({
                    info: info
                });
            }
        });
    },
    //获取公司信息
    getCompanyinfo(businessid) {
        var that = this;
        wx.request({
            url: 'https://xggserve.com/xgg/getcompanyinfo',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                businessid: businessid
            },
            success: function (res) {
                wx.hideToast();
                let data = res.data.data;
                if (data) {
                    that.setData({
                        compinfo: data
                    });
                }
            }
        })
    },
    clickontheEnter(){
        var userInfo = getApp().globalData.userInfo;
        if (userInfo) {
            let URL = '../addappoint/addappoint?serveid='
                + this.data.info.serveid
                + '&businessid=' + this.data.info.businessid
                + '&btime=' + this.data.info.btime
                + '&etime=' + this.data.info.etime;
            wx.navigateTo({
                url: URL
            })
        }
        else {
            wx.showModal({
                title: '无法预约',
                content: '未能获取您的用户信息，请删除小程序重新进入，或者在授权窗口中选择允许获取您的用户信息。',
                confirmText: '',
                showCancel: false
            })
        }
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
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: 'title', // 分享标题
            desc: 'desc', // 分享描述
            path: 'path' // 分享路径
        }
    }
})