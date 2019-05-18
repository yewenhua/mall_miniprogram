//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        loading: false,
        datalist: [],
        imgUrls: [
          'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
          'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
          'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ],
        indicatorDots: true,
        autoplay: true,
        circular: true,
        interval: 3000,
        duration: 500
    },

    onLoad: function (options) {
        this.lists(()=>{});
    },

    onPullDownRefresh() {
        this.setData({
            datalist: []
        });

        this.lists(() => {
            wx.stopPullDownRefresh();
        });
    },

    lists(cb) {
      var that = this;
      var url = app.globalData.api_url + '/mall/category';

      var data = {};
      var action = { header: 'application/json', method: 'post', url: url };
      if (!that.data.loading) {
        app.showLoading('加载中…');
        that.setData({
          loading: true
        });

        app.api(action, data, function (rtn) {
          app.hideLoading();

          if (rtn.code == 0) {
            for (let i = 0; i < rtn.data.length; i++){
              for (let j = 0; j < rtn.data[i].goodslist.length; j++) {
                rtn.data[i].goodslist[j].img = app.globalData.base_url + rtn.data[i].goodslist[j].face;
              }
              rtn.data[i].face = app.globalData.base_url + rtn.data[i].img_url;
            }
            that.setData({
              datalist: rtn.data,
              loading: false
            });
          }
          else {
            that.setData({
              loading: false,
            });
            app.showToast(rtn.msg, '/images/cry_white.png', 'img');
          }
          cb();
        });
      }
    },

    detail(e){
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
          url: '../detail/detail?id=' + id
        });
    },

    category() {
      wx.switchTab({
        url: '../category/category'
      });
    }
});