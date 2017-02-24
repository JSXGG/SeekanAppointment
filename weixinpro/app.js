//app.js

let {WeToast} = require('./component/wetoast/wetoast.js');    // 返回构造函数，变量名可自定义
require('./component/datetools/datatools');
App({
  WeToast,
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    this.getUserInfo();
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    }
    else{
      //调用登录接口
      wx.login({
        success: function (res) {
          var code = res.code;
          wx.getUserInfo({
            success: function (res) {
              var data = {
                code: code,
                encryptedData: res['encryptedData'],
                iv: res['iv'],
                appid: 'wx3eebe8ae1e4e60f7',
                secret: 'c18da056dc345ab5e934104bd2814e00'
              }
              that.setamlogin(data);
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  //登录
  setamlogin: function (data) {
    var weak_this = this;
    wx.request({
      url: 'https://xggserve.com/xgg/amlogin',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: data,
      success: function (res){
        let usedata = res.data['data'];
        if(usedata){
          weak_this.globalData.userInfo = usedata;
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})