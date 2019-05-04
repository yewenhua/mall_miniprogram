var app = getApp();

Page({
    data: {
      address: null,
      orderGoods: null,
      money: 0,
      num: 0
    },
    onLoad: function (options) {
      // 页面初始化 options为页面跳转所带来的参数
      let money = 0;
      let num = 0;
      for (let i=0; i<app.globalData.orderGoods.length; i++){
        money = money + app.globalData.orderGoods[i].num * app.globalData.orderGoods[i].good.sale_price;
        num = num + app.globalData.orderGoods[i].num;
      }

      this.setData({
        orderGoods: app.globalData.orderGoods,
        money: money,
        num: num
      });
    },
    
    topay: function () {
        app.globalData.orderGoods = [];
        wx.redirectTo({
            url: '../pay/pay'
        })
    },
    select_address(){
      let that = this;
      wx.chooseAddress({
        success(res) {
          console.log(res.userName)
          console.log(res.postalCode)
          console.log(res.provinceName)
          console.log(res.cityName)
          console.log(res.countyName)
          console.log(res.detailInfo)
          console.log(res.nationalCode)
          console.log(res.telNumber)
          that.setData({
            address: res
          });
        },
        fail(err){

        }
      });
    },

    pay() {
      wx.requestPayment({
        timeStamp: '',
        nonceStr: '',
        package: '',
        signType: 'MD5',
        paySign: '',
        success(res) {

        },
        fail(res) {

        }
      });
    }
})