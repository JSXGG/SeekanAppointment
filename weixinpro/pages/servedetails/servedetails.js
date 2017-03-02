Page({
    data: {
        info: {},
        compinfo:{}
    },
    onLoad: function (options){
        // 生命周期函数--监听页面加载
        this.getserveinfo(options.serveid);
        this.getCompanyinfo(options.businessid);

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
                var info = res.data.data;
                var btime = new Date(parseInt(info.btime)*1000);
                var etime = new Date(parseInt(info.etime)*1000);
                info.btime = btime.pattern('yyyy-MM-dd HH:mm');
                info.etime = etime.pattern('yyyy-MM-dd HH:mm');
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
                var data = res.data.data;
                if (data){
                    that.setData({
                        compinfo:data
                    });
                }
                console.log(data);
            }
        })
    },
    clickontheEnter(){
        var URL = '../addappoint/addappoint?serveid='
            +this.data.info.serveid
            +'&businessid='+this.data.info.businessid
            +'&btime='+this.data.info.btime
            +'&etime='+this.data.info.etime;
        wx.navigateTo({
            url: URL
        })
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