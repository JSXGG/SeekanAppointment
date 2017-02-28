Page({
    data: {
        info: {},
        binfo:{},
        sinfo:{}
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        this.getmyamdetails(options.id);
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
    getmyamdetails:function(id){
        var that = this;
        var uid = getApp().globalData.userInfo.id;
        wx.request({
            url: 'https://xggserve.com/xgg/getmyamdetails',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'id': id,
                'uid':uid
            },
            success: function (res) {
                console.log(res.data);
                var info = res.data.data.info;//预约详细信息。
                var binfo = res.data.data.binfo;//公司信息
                var sinfo = res.data.data.sinfo;//服务信息。
                var btime = new Date(parseInt(sinfo.btime)*1000);
                var etime = new Date(parseInt(sinfo.etime)*1000);
                var time = new Date(parseInt(info.time)*1000);
                sinfo.btime = btime.pattern('yyyy-MM-dd HH:mm');
                sinfo.etime = etime.pattern('yyyy-MM-dd HH:mm');
                info.time = time.pattern('yyyy-MM-dd HH:mm');
                that.setData({
                    info: info,
                    binfo:binfo,
                    sinfo:sinfo
                });
            }
        });
    },
    clickonthecancle(){
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定取消您的预约吗?',
            success: function (res) {
                if (res.confirm) {
                    that.removieappoingment(that.data.info.id);
                }
            }
        })
    },
    //删除预约
    removieappoingment(id){
        wx.showToast({
            title: '正在删除',
            icon: 'loading'
        });
        var uid = getApp().globalData.userInfo.id;
        wx.request({
            url: 'https://xggserve.com/xgg/delappointment',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                'id': id,
                'uid':uid
            },
            success: function (res) {
                if (res.data.error) {
                    wx.showToast({
                        title: res.data.error,
                        icon: 'success',
                        duration: 10000
                    });
                }
                else {
                    wx.hideToast();
                    wx.navigateBack({
                        delta: 1 // 回退前 delta(默认为1) 页面
                    });
                }
            }
        });
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