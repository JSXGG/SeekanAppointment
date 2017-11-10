Page({
    data: {
        currentTab: 0,
        items_1: [],
        items_2: [],
        items_3: [],
        items: [],
        showUnappment: false
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
        // 生命周期函数--监听页面显示 getmyconvention
        var userInfo = getApp().globalData.userInfo;
        this.getmyorder(userInfo.id);
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
    },
    /**
     * 点击tab切换
     */
    swichNav: function (e) {
        this.setData({
            currentTab: e.target.dataset.current
        });
        this.reloadItems();
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
    getmyorder(uid) {
        wx.showToast({
            title: '正在请求',
            icon: 'loading',
            duration: 10000
        });
        var that = this;
        wx.request({
            url: 'https://xggserve.com/xgg/getmyorder',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {uid: uid},
            success: function (res) {
                wx.stopPullDownRefresh();
                var items = res.data.data;
                wx.hideToast();
                if (items.length == 0) {
                    that.setData({
                        showUnappment: true
                    });
                }
                else {
                    that.setData({
                        showUnappment: false
                    });
                }
                if (items) {
                    let items1 = [];
                    let items2 = [];
                    let items3 = [];
                    for (let i = 0; i < items.length; i++) {
                        let Obj = items[i];
                        Obj.time = new Date(parseInt(Obj.time) * 1000);
                        Obj.time = Obj.time.pattern('yyyy-MM-dd HH:mm')
                        if (Obj.state == 0) {
                            Obj.state = '未处理';
                            items1.push(Obj);
                        }
                        else if (Obj.state == 1) {
                            Obj.state = '已接受';
                            items2.push(Obj);
                        }
                        else if (Obj.state == -1) {
                            Obj.state = '已拒绝';
                            items3.push(Obj);
                        }
                        else if (Obj.state == 2) {
                            Obj.state = '服务已删除'
                        }
                    }
                    that.setData({
                        allItems: items,
                        items_1: items1,
                        items_2: items2,
                        items_3: items3
                    });
                    that.reloadItems();
                }
            }
        })
    },
    //点击进入订单详情。
    clickOntheCellitem: function (e) {
        var that = this;
        var item = e.currentTarget.dataset.item;
        wx.showActionSheet({
            itemList: ['接受预约', '拒绝预约', '拨打客户电话'],
            success: function (res) {
                if (res.tapIndex == 0) {
                    that.dealmyorder(item.id, 1)
                }
                else if (res.tapIndex == 1) {
                    that.dealmyorder(item.id, -1)
                }
                else if (res.tapIndex == 2) {
                    wx.makePhoneCall({
                        phoneNumber: item.tel, //此号码并非真实电话号码，仅用于测试
                        success: function () {
                            console.log("拨打电话成功！")
                        },
                        fail: function () {
                            console.log("拨打电话失败！")
                        }
                    })
                }
            }
        })
    },
    dealmyorder(id, state) {
        var userInfo = getApp().globalData.userInfo;
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
                uid: userInfo.id,
                id: id,
                state: state
            },
            success: function (res) {
                wx.hideToast();
                if (res.data.result == 1) {
                    that.getmyorder(userInfo.id);
                }
                else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.error
                    })
                }
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