//index.js
//获取应用实例
var sliderWidth = 60; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
var util = require("../../utils/util.js");

Page({
    data: {
        tabs: ["全部", "待付款", "待发货", "待收货"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        screenWidth: '',
        datalist: [],
        loading: false,
        num: 5,
        page: 1,
        totalPage: 1,
        totalCount: 0,
    },
    onLoad: function () {
        // var states = parseInt(options.states);
        var that = this;
        var states = 0;
        this.setData({
            states: states,
        });

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    screenWidth: res.screenWidth,
                    sliderLeft: (res.screenWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.screenWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
        this.lists();
    },
    lower: function () {
        if (this.data.page < this.data.totalPage && !this.data.loading) {
            this.setData({
                page: this.data.page + 1
            });

            this.lists();
        }
    },
    lists() {
      var that = this;
      var url = app.globalData.api_url + '/mall/orderlist';

      var data = {
          num: this.data.num,
          searchKey: '',
          page: this.data.page
      };
      var action = { header: 'application/json', method: 'post', url: url };
      if (!that.data.loading) {
        app.showLoading('加载中…');
        that.setData({
          loading: true
        });

        app.api(action, data, function (rtn) {
          app.hideLoading();
          if (rtn.code == 0) {
            for (let i = 0; i < rtn.data.rows.length; i++) {
                let total = 0;
                for (let j = 0; j < rtn.data.rows[i].orderGoods.length; j++) {
                    rtn.data.rows[i].orderGoods[j].face = app.globalData.base_url + rtn.data.rows[i].orderGoods[j].goods_img
                    total = total + Number(rtn.data.rows[i].orderGoods[j].num);
                }
                rtn.data.rows[i].total = total;
                rtn.data.rows[i].time = util.formatTime(new Date(rtn.data.rows[i].createdAt)).substring(0, 16);
            }
            let oData = that.data.datalist;
            let nData = oData.concat(rtn.data.rows);
            that.setData({
              datalist: nData,
              totalCount: rtn.data.count,
              totalPage: Math.ceil(rtn.data.count/that.data.num),
              loading: false
            });
          }
          else {
            that.setData({
              loading: false,
              page: that.data.page - 1
            });
            app.showToast(rtn.msg, '/images/cry_white.png', 'img');
          }
        });
      }
    },
    chgtab(){
        this.setData({
            datalist: [],
            page: 1,
            totalPage: 1,
            totalCount: 0
        });

        this.lists();
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    currentChanged: function (e) {
        this.setData({
            sliderOffset: this.data.screenWidth / this.data.tabs.length * e.detail.current,
            activeIndex: e.detail.current
        });

        this.chgtab();
    }
})