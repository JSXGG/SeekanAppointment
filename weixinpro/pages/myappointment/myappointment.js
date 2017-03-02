Page({
    data: {
        items: [],
        showUnappment:false
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载

    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成


    },
    onShow: function () {
        // 生命周期函数--监听页面显示
        var uid = getApp().globalData.userInfo.id;
        this.getmyconvention(uid);
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏

    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作
        var uid = getApp().globalData.userInfo.id;
        this.getmyconvention(uid);
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
                wx.stopPullDownRefresh();
                var items = res.data.data;
                if(items.length==0){
                    that.setData({
                        showUnappment:true
                    });
                }
                else {
                    that.setData({
                        showUnappment:false
                    });
                }
                if (items) {
                    for(var obj in items){
                        var time = items[obj].time;
                        time = new Date(parseInt(time)*1000);
                        items[obj].time = time.pattern('yyyy-MM-dd HH:mm');
                        if(items[obj].state == 0){
                            items[obj].state = '未处理'
                        }
                        else if(items[obj].state == 1){
                            items[obj].state = '已接受'
                        }
                        else if(items[obj].state == -1){
                            items[obj].state = '已拒绝'
                        }
                    }
                    that.setData({
                        items: items
                    })
                }
            }
        });
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