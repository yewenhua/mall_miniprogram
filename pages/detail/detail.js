// pages/detail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      data: null,
      id: '',
      num: 0,
      firstProperties: { title: '', list: [] },
      secondProperties: { title: '', list: [] },
      selectedProperties: '',
      selectedOK: false,
      operateType: 'buy',
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 3000,
      duration: 500,
      isPopup: false,
      count: 1,
      pt: false,
      popHeight: 610,
      timeup: '',
      leftTime: 2 * 24 * 60 * 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options && options.id){
        this.setData({
           id: options.id
        });

        this.detail();
      }

      //pintuan
      if(options && options.pt == 1){
          this.setData({
             pt: true
          });

          this.timeup();
      }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  gocart(){
    wx.switchTab({
      url: '../cart/cart'
    });
  },

  preview: function (e) {
    this.setData({
      operateType: e.target.dataset.type
    });

    if (this.data.data && this.data.data.is_sku == 1) {
      this.popup();
    }
    else{
      this.buy();
      wx.navigateTo({
        url: '../preview/preview'
      });
    }
  },

  cart: function (e){
    this.setData({
      operateType: e.target.dataset.type
    }); 

    if (this.data.data && this.data.data.is_sku == 1){
      this.popup();
    }
    else{
      app.showToast('添加成功', 'success', 'icon');
      this.addCart();
    }
  },

  subOrder() {
    if (!this.data.selectedOK){
      app.showToast('选择商品属性', '/images/cry_white.png', 'img');
      return false;
    }

    if(this.data.num <= 0){
      app.showToast('没有库存', '/images/cry_white.png', 'img');
      return false;
    }

    if (this.data.operateType == 'cart') {
      this.popup();
      this.addCart();
      
      app.showToast('添加成功', 'success', 'icon');
    }
    else {
      this.buy();

      wx.navigateTo({
        url: '../preview/preview'
      });
    }
  },

  buy(){
    app.globalData.orderGoods = [{
      good: {
        id: this.data.data.id,
        face_img: this.data.data.face_img,
        sale_price: this.data.data.sale_price,
        name: this.data.data.name
      },
      sku: {
        firstProperties: this.data.firstProperties,
        secondProperties: this.data.secondProperties
      },
      checked: false,
      txtStyle: '',
      value: this.data.data.id,
      total: this.data.num,
      selectedProperties: this.data.selectedProperties,
      num: this.data.count
    }];
  },

  addCart(){
    if (!this.in_carts(app.globalData.orderGoods, this.data.data.id, this.data.selectedProperties)) {
      app.globalData.orderGoods.push({
        good: {
          id: this.data.data.id,
          face_img: this.data.data.face_img,
          sale_price: this.data.data.sale_price,
          name: this.data.data.name
        },
        total: this.data.num,
        sku: {
          firstProperties: this.data.firstProperties,
          secondProperties: this.data.secondProperties
        },
        checked: false, 
        txtStyle: '',
        value: this.data.data.id,
        selectedProperties: this.data.selectedProperties,
        num: this.data.count
      });
    }
    else {
      for (let i = 0; i < app.globalData.orderGoods.length; i++) {
        if (this.data.data.id == app.globalData.orderGoods[i].good.id) {
          app.globalData.orderGoods[i].num = app.globalData.orderGoods[i].num + this.data.count;
          break;
        }
      }
    }
  },

  popup: function () {
      if (this.data.isPopup) {
          this.setData({
            isPopup: false
          });
      } else {
          this.setData({
            isPopup: true
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
          if (this.data.count < this.data.num) {
            this.setData({
                count: this.data.count + 1
            });
          }
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
  },

  in_array(arr, val){
    if (arr.length == 0){
      return false;
    }
    else{
      let flag = false;
      for (let i = 0; i < arr.length; i++){
        if(arr[i].id == val){
          flag = true;
          break;
        }
      }

      return flag;
    }
  },

  in_carts(arr, val, selectedProperties) {
    if (arr.length == 0) {
      return false;
    }
    else {
      let flag = false;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].good.id == val && arr[i].selectedProperties == selectedProperties) {
          flag = true;
          break;
        }
      }

      return flag;
    }
  },

  updateDisplay() {
    let firstAttrId = '';
    let secondAttrId = '';
    let hasTwo = false;  //是否有第二属性
    for (let i=0; i < this.data.firstProperties.list.length; i++) {
      if (this.data.firstProperties.list[i].selected) {
        firstAttrId = this.data.firstProperties.list[i].id;
      }
    }

    if (this.data.secondProperties.title) {
      hasTwo = true; //有第二属性
      for (let i=0; i < this.data.secondProperties.list.length; i++) {
        if (this.data.secondProperties.list[i].selected) {
          secondAttrId = this.data.secondProperties.list[i].id;
        }
      }
    }

    let selectedProperties = '';
    let num = 0;
    let selectedOK = false;
    if (firstAttrId && secondAttrId) {
      //选择了属性一和属性二
      for (let i=0; i < this.data.data.skus.length; i++) {
        if (this.data.data.skus[i].first_properties_id == firstAttrId && this.data.data.skus[i].second_properties_id == secondAttrId) {
          num = this.data.data.skus[i].num;
          selectedProperties = this.data.data.skus[i].firstProperty.name + '，' + this.data.data.skus[i].secondProperty.name;
          selectedOK = true;
        }
      }
    }
    else if (firstAttrId && !secondAttrId) {
      //只选择了属性一
      for (let i=0; i < this.data.data.skus.length; i++) {
        if (this.data.data.skus[i].first_properties_id == firstAttrId) {
          num = num + this.data.data.skus[i].num;
          selectedProperties = this.data.data.skus[i].firstProperty.name;
        }
      }

      if (hasTwo){
        //有第二属性，但没选择第二属性
        selectedOK = false;
      }
      else{
        //没有第二属性
        selectedOK = true;
      }
    }
    else if (!firstAttrId && secondAttrId) {
      //只选择了属性二
      for (let i=0; i < this.data.data.skus.length; i++) {
        if (this.data.data.skus[i].second_properties_id == secondAttrId) {
          num = num + this.data.data.skus[i].num;
          selectedProperties = this.data.data.skus[i].secondProperty.name;
        }
      }
      selectedOK = false;
    }
    else {
      //都没选
      for (let i=0; i < this.data.data.skus.length; i++) {
        num = num + this.data.data.skus[i].num;
        selectedProperties = '';
      }
      selectedOK = false;
    }

    this.setData({
      num: num,
      selectedProperties: selectedProperties,
      selectedOK: selectedOK
    });
  },

  chgsku(e) {
    let skus = null;
    let type = e.target.dataset.type;
    let index = e.target.dataset.index;
    if (type == 'first'){
      skus = this.data.firstProperties.list;
    }
    else{
      skus = this.data.secondProperties.list;
    }

    for (var i = 0; i < skus.length; i++) {
      if (i == index) {
        if (skus[i].selected) {
          skus[i].selected = false;
        }
        else {
          skus[i].selected = true;
        }
      }
      else {
        skus[i].selected = false;
      }
    }

    if (type == 'first') {
      let newData = this.data.firstProperties;
      newData.list = skus;
      this.setData({
        firstProperties: newData
      });
    }
    else{
      let newData = this.data.secondProperties;
      newData.list = skus;
      this.setData({
        secondProperties: newData
      });
    }

    this.updateDisplay();
  },

  detail() {
    var that = this;
    var url = app.globalData.api_url + '/mall/goodsdetail';

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

        if (rtn.code == 0) {
          let mainpic = [];
          let detailpic = [];
          rtn.data.face_img = app.globalData.base_url + rtn.data.face;
          for (let i = 0; i < rtn.data.images.length; i++) {
            if (rtn.data.images[i].type == 'main'){
              mainpic.push(
                app.globalData.base_url + rtn.data.images[i].url
              );
            }
            else{
              detailpic.push(
                app.globalData.base_url + rtn.data.images[i].url
              );
            }
            
            rtn.data.mainpic = mainpic;
            rtn.data.detailpic = detailpic;
          }

          let firstProperties = {title: '', list: []};
          let secondProperties = { title: '', list: [] };
          for (let i = 0; i < rtn.data.skus.length; i++) {
            //第一属性
            firstProperties.title = rtn.data.skus[i].firstProperty.title;
            if (!that.in_array(firstProperties.list, rtn.data.skus[i].first_properties_id)){
              firstProperties.list.push({
                id: rtn.data.skus[i].first_properties_id,
                name: rtn.data.skus[i].firstProperty.name,
                selected: false
              });
            }

            //有第二属性
            if (rtn.data.skus[i].second_properties_id) {
              secondProperties.title = rtn.data.skus[i].secondProperty.title;
              if (!that.in_array(secondProperties.list, rtn.data.skus[i].second_properties_id)){
                secondProperties.list.push({
                  id: rtn.data.skus[i].second_properties_id,
                  name: rtn.data.skus[i].secondProperty.name,
                  selected: false
                });
              }
            }
          }

          let height = 610;
          if (rtn.data.is_sku == 1){
            if (firstProperties.list.length <= 4) {
              height = 610;
            }
            else {
              height = height + Math.ceil((firstProperties.list - 4) / 4) * 90;
            }

            if (secondProperties.title){
              if (secondProperties.list.length <= 4) {
                height = height + 160;
              }
              else {
                height = height + Math.ceil((secondProperties.list - 4) / 4) * 90;
              }
            }
          }

          that.setData({
            data: rtn.data,
            num: rtn.data.remain_num,
            firstProperties: firstProperties,
            secondProperties: secondProperties,
            popHeight: height,
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
})