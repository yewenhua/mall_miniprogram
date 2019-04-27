Page({
    data: {
      address: null
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
    },
    
    onShow: function () {
        // 页面显示
    },
    
    tosearch: function () {
        wx.navigateTo({
            url: '../searchProduct/searchProduct'
        })
    },
    topay: function () {
        wx.navigateTo({
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