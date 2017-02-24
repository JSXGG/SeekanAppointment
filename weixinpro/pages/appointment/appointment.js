Page({
    data: {
        items: []
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var uid = getApp().globalData.userInfo.id;
        this.getmyconvention(uid);
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
    onUnload: function () {
        // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
    },
    getmyconvention: function (uid) {
        var that = this;
        wx.request({
            url: 'https://xggserve.com/xgg/getmyconvention',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                uid: uid,
            },
            success: function (res) {
                var items = res.data.data;
                // var btime = new Date(parseInt(data.btime)*1000);
                // btime.pattern('yyyy-MM-dd')

                if (items) {
                    for(var obj in items){
                        var time = items[obj].time;
                        time = new Date(parseInt(time)*1000);
                        items[obj].time = time.pattern('yyyy-MM-dd HH:mm');
                    }
                    that.setData({
                        items: items
                    })
                }
            }
        });
    },
    clickOntheCellitem:function () {

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