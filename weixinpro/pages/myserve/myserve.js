Page({
    data: {
        info: {},
        items: [],
        showview: false
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
        this.getCompanyinfo(userInfo.id);
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
    //获取公司信息
    getCompanyinfo(uid) {
        var that = this;
        wx.request({
            url: 'https://xggserve.com/xgg/getcompanyinfo',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                adminid: uid
            },
            success: function (res) {
                var businessid = res.data.data.businessid;
                if (businessid) {
                    that.getServelist(uid, businessid)
                }
            }
        })
    },
    //获取服务列表
    getServelist(uid, businessid) {
        wx.showNavigationBarLoading();
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
                wx.hideNavigationBarLoading();
                var list = res.data.data.list;
                var info = res.data.data.info;
                var listinfo = [];
                for (var index in list) {
                    var obj = list[index];
                    obj['icon'] = info['icon'];
                    listinfo.push(obj);
                }
                that.setData({
                    items: listinfo,
                    info: info
                })
                that.setData({
                    showview: true
                });
                wx.hideToast()
            }
        })
    },
    //添加服务。
    addserve: function () {
        //点击列表事件。
        var URL =
            '../addserve/addserve?uid=' +
            this.data.info.adminid +
            '&businessid=' +
            this.data.info.businessid;
        console.log(URL);
        wx.navigateTo({
            url: URL
        })
    },
    //刷新列表。
    reloadItems: function () {
        this.getServelist(this.data.info.adminid, this.data.info.businessid)
    },
    //点击进入公司详细信息。
    clickOntheheaderitem: function () {
        var URL = '../mycompany/mycompany';
        wx.navigateTo({
            url: URL
        })
    },
    //点击进入服务详情。
    clickOntheCellitem: function (e) {
        var item = e.currentTarget.dataset.item;
        //点击列表事件。
        var URL = '../addserve/addserve?uid=' + this.data.info.adminid + '&businessid=' + this.data.info.businessid+'&serveid='+item.serveid;
        wx.navigateTo({
            url: URL
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