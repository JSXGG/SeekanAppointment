Page({
    data: {
        info: {},
        array: ['移动互联网', '电子商务', '汽车行业', '餐饮行业', '保险服务'],
        tempFilePaths: '',
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
        this.getcompanyinfo(userInfo.id);
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
    bindNameChange: function (e) {
        this.data.info.name = e.detail.value
        this.setData({
            info: this.data.info
        })
    },
    bindAddressChange: function (e) {
        this.data.info.address = e.detail.value
        this.setData({
            info: this.data.info
        })
    },
    bindTelChange:function (e) {
        this.data.info.tel = e.detail.value
        this.setData({
            info: this.data.info
        })
    },
    bindTypeChange: function (e) {
        this.data.info.type = e.detail.value
        this.setData({
            info: this.data.info
        })
    },
    bindInfoChange: function (e) {
        this.data.info.info = e.detail.value
        this.setData({
            info: this.data.info
        })
    },
    getcompanyinfo(uid){
        wx.showToast({
            title: '正在请求',
            icon: 'loading',
            duration: 10000
        })
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
                wx.hideToast();
                that.setData({
                    info: res.data.data
                });
            }
        })
    },
    //点击保存。
    clickontheEnter: function () {
        if (this.data.info.name.length == 0) {
            this.toastErrorWithText('请填写公司名称');
        }
        else if (this.data.info.info.length == 0) {
            this.toastErrorWithText('请填写公司简介');
        }
        else if (this.data.info.address.length == 0) {
            this.toastErrorWithText('请填写公司地址');
        }
        else if (!getApp().SeekanAppTools.checkphone(this.data.info.tel)) {
            this.toastErrorWithText('请填写正确的服务热线');
        }
        else {
            let data = {
                uid: this.data.info.adminid,
                name: this.data.info.name,
                address: this.data.info.address,
                tel: this.data.info.tel,
                type: this.data.info.type,
                info: this.data.info.info,
                businessid: this.data.info.businessid
            };
            this.updatecompanyinfo(data);
        }
    },
    //更新信息。
    updatecompanyinfo: function (data) {
        wx.showToast({
            title: '正在修改',
            icon: 'loading',
            duration: 10000
        })
        var that = this;
        wx.request({
            url: 'https://xggserve.com/xgg/updatecompanyinfo',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: data,
            success: function (res) {
                if (res.data.result == '1'){
                    if (that.data.tempFilePaths.length == 0) {
                        that.upDataFinish();
                    }
                    else {
                        that.uploadcompanyicon();
                    }
                }
                else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.error,
                        showCancel: false,
                        confirmText: '知道了'
                    })
                }
            }
        })
    },
    //上传图片。
    uploadcompanyicon: function () {
        var that = this;
        wx.uploadFile({
            url: 'https://xggserve.com/xgg/uploadcompanyicon',
            filePath: this.data.tempFilePaths,
            header: {
                'content-type': 'application/json'
            },
            name: 'img',
            formData: {
                'uid': this.data.info.adminid,
                'businessid': this.data.info.businessid
            },
            success: function (res) {
                let Data = JSON.parse(res.data);
                if (Data.result == '1') {
                    that.upDataFinish();
                }
                else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.error,
                        showCancel: false,
                        confirmText: '知道了'
                    })
                }
            }
        })
    },
    //点击商标。
    clickontheheader: function () {
        console.log('商标');
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                that.data.info.icon = tempFilePaths[0];
                that.data.tempFilePaths = tempFilePaths[0];
                that.setData({
                    info: that.data.info
                });
            }
        });
    },
    toastErrorWithText: function (text) {
        wx.showToast({
            title: text,
            duration: 1000
        })
    },
    upDataFinish: function () {
        wx.hideToast();
        setTimeout(function () {
            wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 10000,
                mask: true
            });
            setTimeout(function () {
                wx.navigateBack({
                    delta: 1 // 回退前 delta(默认为1) 页面
                });
            }, 1000)
        }, 1000);


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