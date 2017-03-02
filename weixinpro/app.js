//app.js
require('./component/datetools/datatools');
import SeekanAppTools from './component/datetools/datatools'
App({
    SeekanAppTools,
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        this.getUserInfo();
    },
    getUserInfo: function (cb) {
        var that = this;
        if (this.globalData.userInfo) {
            return cb(this.globalData.userInfo);
        }
        else {
            //调用登录接口

            wx.showToast({
                title: '加载中',
                icon: 'loading',
                duration: 20000
            })
            wx.login({
                success: function (res) {
                    var code = res.code;
                    if (code) {
                        wx.getUserInfo({
                            success: function (res) {
                                var data = {
                                    code: code,
                                    encryptedData: res['encryptedData'],
                                    iv: res['iv'],
                                    appid: 'wx3eebe8ae1e4e60f7',
                                    secret: 'c18da056dc345ab5e934104bd2814e00'
                                }
                                that.setamlogin(data, cb);
                            },
                            fail: function (error) {
                                wx.hideToast();
                                if (cb) {
                                    cb({error: error});
                                }
                            }
                        })
                    }
                }, fail: function (error) {
                    wx.hideToast();
                    if (cb) {
                        cb({error: error});
                    }
                }
            })
        }
    },
    //登录
    setamlogin: function (data, cb) {
        var that = this;
        wx.request({
            url: 'https://xggserve.com/xgg/amlogin',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: data,
            success: function (res) {
                wx.hideToast();
                let usedata = res.data['data'];
                if (usedata) {
                    that.globalData.userInfo = usedata;
                    if (cb) {
                        return cb(usedata);
                    }
                }
            },
            fail: function (error) {
                wx.hideToast();
                if (cb) {
                    cb({error: error});
                }
            }
        })
    },
    globalData: {
        userInfo: null
    }
})