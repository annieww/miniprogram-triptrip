import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['20%', '40%'],
      data: [{
        value: 55,
        name: '北京'
      }, {
        value: 20,
        name: '武汉'
      }, {
        value: 10,
        name: '杭州'
      }, {
        value: 20,
        name: '广州'
      }, {
        value: 38,
        name: '上海'
      }]
    }]
  };

  chart.setOption(option);
  return chart;
}

// pages/trips/admin.js
Page({

  /**
   * Page initial data
   */
  data: {
    ec: {
      onInit: initChart
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    if (app.globalData.header) {
      // proceed to fetch api
      this.getData()
    } else {
      // wait until loginFinished, then fetch API
      wx.event.on('loginFinished', this, this.getData)
    }
  },
  getData() {
    let page = this
    let id = page.options.id
    console.log(id)
    // console.log('From show.js - onshow: options ', page.options)
    // let id = this.data.id
    wx.request({
      header: app.globalData.header,
      url: `${app.globalData.baseURL}/trips/${id}`,
      success(res) {
        console.log("From show.js - onshow: res", res)
        if (res.statusCode === 200) {
          // console.log("From show.js - onshow: booking", res.data.my_booking);
          // console.log("From show.js - onshow: trip's user_id", res.data.trip.user_id)
          const trip = res.data.trip;
          const isBooker = res.data.is_booker;
          const isSaved = res.data.is_saved;
          // const booking = res.data.my_booking;
          page.setData({
            trip: trip,
            isBooker: isBooker,
            isSaved: isSaved,
            bookmarkId: res.data.bookmark_id
          });
          console.log("From show.js: status code is", res.statusCode)
        }
      }
    })
  },

  goToShow(e) {
    const tripId = e.currentTarget.dataset.id
    // console.log(e.currentTarget)
    wx.navigateTo({
      url: `/pages/trips/show?id=${tripId}`,
    })
  },

  goToEdit(e) {
    const tripId = e.currentTarget.dataset.id
    wx.setStorageSync('tripId', tripId)
    wx.navigateTo({
      header: app.globalData.header,
      url: `/pages/trips/form`,
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})