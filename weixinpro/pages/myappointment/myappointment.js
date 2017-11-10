Page({
    data: {
        currentTab: 0,
        items: [],
        items_1: [],
        items_2: [],
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
    },
    swichNav: function (e) {
        this.setData({
            currentTab: e.target.dataset.current
        });
        this.reloadItems();
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
                if (items) {
                    let items1 = [];
                    let items2 = [];
                    for (var obj in items) {
                        var time = items[obj].time;
                        time = new Date(parseInt(time) * 1000);
                        items[obj].time = time.pattern('yyyy-MM-dd HH:mm');
                        if (items[obj].state == 0) {
                            items[obj].state = '未处理';
                            items1.push(items[obj]);
                        }
                        else if (items[obj].state == 1) {
                            items[obj].state = '已接受';
                            items2.push(items[obj]);
                        }
                        else if (items[obj].state == -1) {
                            items[obj].state = '已拒绝';
                            items2.push(items[obj]);
                        }
                    }
                    that.setData({
                        items_1: items1,
                        items_2: items2
                    });
                    that.reloadItems();
                }
            }
        });
    },
    reloadItems: function () {
        if (this.data.currentTab == '0') {
            this.setData({
                items: this.data.items_1
            });
        }
        else if (this.data.currentTab == '1') {
            this.setData({
                items: this.data.items_2
            });
        }
        else if (this.data.currentTab == '2') {
            this.setData({
                items: this.data.items_3
            });
        }
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