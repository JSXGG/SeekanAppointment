Page({
    data: {
        firstname: '',
        phone: '',
        remarks: '',
        date: '',
        time: '6:00',
        options: {}
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        this.setData({
            options: options
        })
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
    bindFirstnameChange: function (e) {
        this.setData({
            firstname: e.detail.value
        })
    },
    bindPhoneChange: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },
    bindRemarksChange: function (e) {
        this.setData({
            remarks: e.detail.value
        })
    },
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value
        })
    },
    clickontheEnter: function (e) {
        console.log(this.data);
        if (this.data.firstname.length == 0) {
            this.toastErrorWithText('请输入贵姓');
        }
        else if (this.data.phone.length != 11) {
            this.toastErrorWithText('请输入正确的手机号码');
        }
        else if (this.data.date.length == 0) {
            this.toastErrorWithText('请输入您的预约日期');
        }
        else if (this.data.time.length == 0) {
            this.toastErrorWithText('请输入您的预约时间');
        }
        else {
            this.showLoadingWith('正在预约');
            var userInfo = getApp().globalData.userInfo;
            var time = this.transfTime(this.data.date, this.data.time);
            var data = {
                serveid: this.data.options.serveid,
                uid: userInfo.id,
                time: time,
                note: this.data.remarks,
                tel: this.data.phone,
                businessid: this.data.options.businessid
            };
            this.setCompanyServe(data);
        }
    },
    //日期转时间戳。
    transfTime: function (date, time) {
        var dates = date.split('-');
        var stringTime = dates[0] + '/'
            + dates[1]
            + '/'
            + dates[2]
            + ' ' + time + ':00';
        var timestamp = Date.parse(new Date(stringTime));
        timestamp = timestamp / 1000;
        return timestamp;
    },
    //预约服务。
    setCompanyServe: function (data) {
        var that = this;
        wx.request({
            url: 'https://xggserve.com/xgg/setcompanyserve',
            method: 'POST',
            data: data,
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res.data);
                if (res.data.result == 1){
                    that.toastSuccessWithText('预约成功');
                    setTimeout(()=> {
                        wx.navigateBack({
                            delta: 2 // 回退前 delta(默认为1) 页面
                        });
                    }, 1000);
                }
                else {
                    that.toastSuccessWithText(res.data.error);
                }
            }
        });
    },

    toastSuccessWithText: function (text) {
        wx.showToast({
            title: text,
            icon: 'success',
            duration: 1000
        })
    },
    toastErrorWithText: function (text) {
        wx.showToast({
            title: text,
            duration: 1000
        })
    },
    showLoadingWith: function (text) {
        wx.showToast({
            title: text,
            icon: 'loading'
        })
    }
})