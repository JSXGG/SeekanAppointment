Page({
    data: {
        title: '',
        content: '',
        bdate: '',
        btime: '',
        edate: '',
        etime: '',
        start1: '2017-02-10',
        end1: '2017-03-10',
        start2: '2017-02-10',
        end2: '2017-03-10',
        options: {}
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        this.setData({
            options: options
        });
        console.log(options);
        if (options.serveid) {
            this.getserveinfo(options.serveid);
        }
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
                if (res.data.data) {
                    that.reloadserveinfo(res.data.data);
                }
            }
        });
    },
    reloadserveinfo: function (data) {
        let btime = new Date(parseInt(data.btime) * 1000);
        let etime = new Date(parseInt(data.etime) * 1000);
        this.setData({
            title: data.title,
            content: data.content,
            bdate: btime.pattern('yyyy-MM-dd'),
            btime: btime.pattern('HH:mm'),
            edate: etime.pattern('yyyy-MM-dd'),
            etime: etime.pattern('HH:mm'),
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
    bindTitleChange: function (e) {
        this.setData({
            title: e.detail.value
        })
    },
    bindContentChange: function (e) {
        this.setData({
            content: e.detail.value
        })
    },
    bindBdateChange: function (e) {
        this.setData({
            bdate: e.detail.value
        })
    },
    bindBtimeChange: function (e) {
        this.setData({
            btime: e.detail.value
        })
    },
    bindEdateChange: function (e) {
        this.setData({
            edate: e.detail.value
        })
    },
    bindEtimeChange: function (e) {
        this.setData({
            etime: e.detail.value
        })
    },
    clickontheEnter: function (e) {
        if (this.data.title.length == 0) {
            this.toastErrorWithText('请输入服务名称');
        }
        else if (this.data.content.length == 0) {
            this.toastErrorWithText('请输入服务内容');
        }
        else if (this.data.bdate.length == 0) {
            this.toastErrorWithText('请输入服务开始日期');
        }
        else if (this.data.btime.length == 0) {
            this.toastErrorWithText('请输入服务开始时间');
        }
        else if (this.data.edate.length == 0) {
            this.toastErrorWithText('请输入服务结束日期');
        }
        else if (this.data.etime.length == 0) {
            this.toastErrorWithText('请输入服务结束时间');
        }
        else {

            var btime = this.transfTime(this.data.bdate, this.data.btime);
            var etime = this.transfTime(this.data.edate, this.data.etime);
            var data = {
                'btime': btime,
                'etime': etime,
                'uid': this.data.options.uid,
                'businessid': this.data.options.businessid,
                'title': this.data.title,
                'content': this.data.content
            };

            if (this.data.options.serveid) {
                data['serveid'] = this.data.options.serveid;
            }
            this.addordercompany(data);
        }
    },
    clickonthedelrecord: function () {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定删除这个服务吗?',
            success: function (res) {
                if (res.confirm) {
                    that.delrecordWithserveid(that.data.options.serveid);
                }
            }
        })
    },
    //删除记录。
    delrecordWithserveid: function (id) {
        var that = this;
        that.showLoadingWith('正在删除');
        var data = {
            serveid: id,
            businessid: this.data.options.businessid,
            uid: this.data.options.uid
        };
        wx.request({
            url: 'https://xggserve.com/xgg/delserverecord',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: data,
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
        })
    },
    // 添加服务。
    addordercompany: function (data) {
        var that = this;
        this.showLoadingWith('保存中...');
        wx.request({
            url: 'https://xggserve.com/xgg/addordercompany',
            method: 'POST',
            data: data,
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data.result == 1) {
                    that.addSuccess();
                }
                else {
                    wx.hideToast();
                    wx.showModal({
                        title: '提示',
                        showCancel:false,
                        confirmText:"知道了",
                        content: res.data.error,
                    });
                }
            }});
        },
    //添加成功
    addSuccess: function () {
        setTimeout(() => {
            wx.hideToast();
            setTimeout(() => {
                this.toastSuccessWithText('保存成功');
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1 // 回退前 delta(默认为1) 页面
                    });
                }, 1000);
            }, 1000)
        }, 1000)
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
        return String(timestamp);
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
            mask:true,
            title: text,
            icon: 'loading',
        })
    }
})