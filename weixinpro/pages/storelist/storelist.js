Page({
  data: {
    items: []
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.getcompanylist();
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    wx.setNavigationBarTitle({
      title: '商家列表'
    });
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  //获取公司列表
  getcompanylist: function () {
    var that = this;
    wx.request({
      url: 'https://xggserve.com/xgg/getcompanylist',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let items = res.data['data'];
        if (items) {
          that.setData({
            items: items
          })
        }
      }
    })
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },
  tapItem: function (event) {
    var item = event.currentTarget.dataset.item;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    this.setConfig(item);
    prevPage.setData({
      currentStoreinfo: item
    })
    wx.navigateBack({
      delta: 1
    })
  },
  //保存数据
  setConfig: function (item) {
    var userInfo = getApp().globalData.userInfo;
    if (userInfo) {
      wx.setStorage({
        key: userInfo['openid'],
        data: item
      })
    }
  }
})