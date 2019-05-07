var app = getApp();
var hasload = false;

Page({
    data: {
      address: null,
      orderGoods: null,
      money: 0,
      num: 0
    },
    onLoad: function (options) {
      hasload = false;
      // 页面初始化 options为页面跳转所带来的参数
      let money = 0;
      let num = 0;
      for (let i=0; i<app.globalData.orderGoods.length; i++){
        money = money + app.globalData.orderGoods[i].num * app.globalData.orderGoods[i].good.sale_price;
        num = num + app.globalData.orderGoods[i].num;
      }

      this.setData({
        orderGoods: app.globalData.orderGoods,
        money: money.toFixed(2),
        num: num
      });

      this.getAddress();

      setTimeout(() => {
        hasload = true;
      }, 300);
    },

    onShow: function () {
      if (hasload) {
        let money = 0;
        let num = 0;
        for (let i = 0; i < app.globalData.orderGoods.length; i++) {
          money = money + app.globalData.orderGoods[i].num * app.globalData.orderGoods[i].good.sale_price;
          num = num + app.globalData.orderGoods[i].num;
        }

        this.setData({
          orderGoods: app.globalData.orderGoods,
          money: money.toFixed(2),
          num: num
        });
        this.getAddress();
      }
    },
    
    topay: function () { 
        if (!this.data.address){
          app.showToast('请选择地址', '/images/cry_white.png', 'img');
          return false;
        }

        let goods_params = [];
        for (let i = 0; i < app.globalData.orderGoods.length; i++){
          goods_params.push({
            goods_id: app.globalData.orderGoods[i].good.id,
            face: app.globalData.orderGoods[i].good.face,
            num: app.globalData.orderGoods[i].num,
            selectedProperties: app.globalData.orderGoods[i].selectedProperties
          });
        }

        let order_params = {
          goods: goods_params,
          address: this.data.address,
          money: this.data.money,
        }

        this.submit(order_params);
    },

    submit(data) {
      var that = this;
      var url = app.globalData.api_url + '/mall/ordercreate';
      var action = { header: 'application/json', method: 'post', url: url };
      if (!that.data.loading) {
        app.showLoading('加载中…');
        that.setData({
          loading: true
        });

        app.api(action, data, function (rtn) {
          app.hideLoading();

          if (rtn.code == 0) {
            app.showToast('操作成功', 'success', 'icon');
            app.globalData.orderGoods = [];
            that.setData({
              loading: false
            });

            setTimeout(()=>{
              wx.switchTab({
                url: '../cart/cart'
              });
            }, 2000);
          }
          else {
            that.setData({
              loading: false,
            });
            app.showToast(rtn.msg, '/images/cry_white.png', 'img');
          }
        });
      }
    },

    getAddress() {
        var that = this;
        var url = app.globalData.api_url + '/mall/address';

        var data = {};
        var action = { header: 'application/json', method: 'get', url: url };
        if (!that.data.loading) {
            app.showLoading('加载中…');
            that.setData({
                loading: true
            });

            app.api(action, data, function (rtn) {
                app.hideLoading();
                if (rtn.code == 0) {
                    that.setData({
                        address: rtn.data,
                        loading: false
                    });
                }
                else {
                    that.setData({
                        loading: false,
                    });
                    app.showToast(rtn.msg, '/images/cry_white.png', 'img');
                }
            });
        }
    },
    
    select_address(){
      let that = this;
      wx.chooseAddress({
        success(res) {
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