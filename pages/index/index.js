//index.js
//获取应用实例
var app = getApp()
Page({
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
        duration: 500
    },

    getData(){
        var that = this;
        wx.request({
            method: action.method,
            url: action.url,
            header: {
                'Content-Type': action.header
            },
            data: data,
            success: function (res) {
                if (res.data.code != 99999) {
                    if (typeof (callback) == 'function') {
                        callback(res.data);
                    }
                }
                else {
                    wx.removeStorageSync('login_session');
                    wx.redirectTo({
                        url: '../login/login'
                    });
                }
            }
        });
    },

    detail(){
        wx.navigateTo({
            url: '../detail/detail'
        });
    }
});