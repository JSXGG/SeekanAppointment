//app.js
require('./component/datetools/datatools');
import SeekanAppTools from './component/datetools/datatools'
App({
    SeekanAppTools,
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        this.getUserInfo(function (cb) {
        });
    },
    getUserInfo: function (cb) {
        var that = this;
        //判断登录是否过期。
        wx.checkSession({
            success: function () {
                //session 未过期，并且在本生命周期一直有效
                wx.getStorage({
                    key: 'WeiXinUserInfo',
                    complete: function (res) {
                        if (res.data) {
                            that.globalData.userInfo = res.data;
                            cb(res.data);
                        }
                        else {
                            that.wxLogin(cb);
                        }
                    }
                })
            },
            fail: function () {
                that.wxLogin(cb);
            }
        });
    },
    wxLogin: function (cb) {
        //调用登录接口
        var that = this;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 20000
        });
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
                            };
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
        });
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
                    wx.setStorage({
                        key: "WeiXinUserInfo",
                        data: that.globalData.userInfo
                    });
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