// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgUrls: [
        'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
        'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
        'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
      ],
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 3000,
      duration: 500,
      popup: false,
      count: 1,
      pt: false,
      timeup: '',
      leftTime: 2 * 24 * 60 * 60,
      detailpic: [
        {
          url: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640'
        },
        {
          url: 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640'
        },
        {
          url: 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        }
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options && options.pt == 1){
          this.setData({
             pt: true
          });

          this.timeup();
      }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  preview: function () {
      wx.navigateTo({
          url: '../preview/preview'
      });
  },

  cart: function (){
      wx.switchTab({
          url: '../cart/cart'
      });
  },

  popup: function (e) {
      if (this.data.popup) {
          this.setData({
              popup: false
          });
      } else {
          this.setData({
              popup: true
          })
      }
  },
  changeNum: function (e) {
      if (e.target.dataset.alphaBeta == 0) {
          if (this.data.count > 1) {
              this.setData({
                  count: this.data.count - 1
              });
          };
      } else {
          this.setData({
              count: this.data.count + 1
          });
      };
  },
  single(){
       
  },
  timeup() {
    var temp = setInterval(function () {
      let time = this.data.leftTime;
      console.log(time);
      let data = {};
      if (time >= 0) {
        var day = Math.floor(time / (24 * 60 * 60));
        var hour = Math.floor((time - (24 * 60 * 60) * day) / (60 * 60));
        var minute = Math.floor((time - (24 * 60 * 60) * day - (60 * 60) * hour) / 60);
        var second = Math.floor(time - (24 * 60 * 60) * day - (60 * 60) * hour - minute * 60);
        data.day_html = day;
        data.hour_html = hour >= 10 ? hour : '0' + hour;
        data.minute_html = minute >= 10 ? minute : '0' + minute;
        data.second_html = second >= 10 ? second : '0' + second;
        data.is_over = false;
      }
      else {
        data.day_html = '0';
        data.hour_html = '00';
        data.minute_html = '00';
        data.second_html = '00';
        data.is_over = true;
      }

      this.setData({
        timeup: data,
        leftTime: time - 1
      });
    }.bind(this), 1000);
  }
})