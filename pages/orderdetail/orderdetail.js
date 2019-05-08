// pages/orderdetail/orderdetail.js
const app = getApp();
var hasload = false;
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    detail: '',
    stars: [0, 1, 2, 3, 4],
    imgSrc: '/images/cha.jpg',
    normalSrc: '/images/normal.png',
    selectedSrc: '/images/selected.png',
    halfSrc: '/images/half.png',
    showRefund: false,
    animationData: {},
    showModalStatus: false,
    content: '',
    orderStatus: {
        nopay: 0,
        payed: 1,
        sended: 2,
        completed: 3,
        canceled: 97,
        refunding: 98,
        refund: 99
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    hasload = false;
    this.setData({
      id: options && options.id ? options.id : ''
    });

    this.detail(() => {
        hasload = true;
    });
  },

  onShow: function () {
    if (hasload) {
      this.detail(() => { });
    }
  },

    detail(cb) {
        var that = this;
        var url = app.globalData.api_url + '/mall/orderdetail';

        var data = {
            id: that.data.id
        };
        var action = { header: 'application/json', method: 'get', url: url };
        if (!that.data.loading) {
            app.showLoading('加载中…');
            that.setData({
                loading: true
            });

            app.api(action, data, function (rtn) {
                app.hideLoading();
                cb();
                if (rtn.code == 0) {
                    rtn.data.time = util.formatTime(new Date(rtn.data.createdAt)).substring(0, 16);
                    that.setData({
                        detail: rtn.data,
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

  refund() {
    wx.navigateTo({
      url: '../refund/refund?id=' + this.data.id
    })
  },

  comment() {
    wx.navigateTo({
      url: '../star/star?id=' + this.data.id
    });
  },

  preview(e) {
    var category = e.currentTarget.dataset.cate;
    if (category == 'main') {
      wx.previewImage({
        current: this.data.imgSrc,
        urls: [this.data.imgSrc]
      });
    }
    else if (category == 'refund') {
      var idx = e.currentTarget.dataset.idx;
      wx.previewImage({
        current: this.data.imgSrc,
        urls: [this.data.imgSrc]
      });
    }
    else {
      var idx = e.currentTarget.dataset.idx;
      wx.previewImage({
        current: this.data.imgSrc,
        urls: [this.data.imgSrc]
      });
    }
  },

  cancelSubmit(e) {
    if (!this.data.content) {
      app.showToast('请输入取消理由', '/static/images/cry_white.png', 'img');
      return false;
    }

    var currentStatus = e.currentTarget.dataset.status;
    this.popup(currentStatus);

    let that = this;
    if (!that.data.loading) {
      that.setData({
        loading: true
      });
      app.showLoading('提交中…');

      let url = app.globalData.api_url + '/app/order/cancel/' + that.data.id;
      let data = {
        id: that.data.id,
        content: that.data.content
      };

      let action = { header: 'application/json', method: 'post', url: url };
      app.api(action, data, function (rtn) {
        that.setData({
          loading: false
        });
        app.hideLoading();
        if (rtn.code == 0) {
          setTimeout(function () {
            app.showToast('提交成功', 'success', 'icon');
            that.detail();
          }, 300);
        }
        else {
          setTimeout(function () {
            app.showToast(rtn.msg, '/static/images/cry_white.png', 'img');
          }, 300);
        }
      });
    }
  },

  contentinput(e) {
    var that = this;
    if (e.detail.value) {
      that.setData({
        content: e.detail.value
      });
    }
    else {
      that.setData({
        content: ''
      });
    }
  },

  cancel() {
    this.popup('open');
  },
  switchPop: function (e) {
    var currentStatus = e.currentTarget.dataset.status;
    this.popup(currentStatus);
  },

  popup: function (currentStatus) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 150, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).translateY(1000).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    });

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).translateY(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      });

      //关闭 
      if (currentStatus == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 150);

    // 显示 
    if (currentStatus == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  }
})