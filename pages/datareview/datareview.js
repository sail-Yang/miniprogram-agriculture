// pages/datareview/datareview.js
import wxCharts from '../../utils/wxcharts.js';
var currentHour = new Date().getHours();
var app = getApp();
var lineChart = null;
var startPos = null;
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    "minValue": 26,
    "averageValue": 32,
    "maxValue": 37,
    "isTemp": true,
    "isHum": false,
    "isGas": false,
    "seriesName": "温度",
    "unit": "℃"
  },
  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  createSimulationData: function () {
    var categories = [];
    var data = [];
    if(that.data.isTemp == true){
      for (var i = 0; i <= currentHour+1; i++) {
        categories.push(i + ":00" );
        data.push(app.globalData.dataList[i].temp);
      }
    }else if(that.data.isHum == true){
      for (var i = 0; i <= currentHour+1; i++) {
        categories.push(i + ":00" );
        data.push(app.globalData.dataList[i].hum);
      }
    }else{
      for (var i = 0; i <= currentHour+1; i++) {
        categories.push(i + ":00" );
        data.push(app.globalData.dataList[i].gas);
      }
    }
    return {
      categories: categories,
      data: data
    }
  },
  updateData: function () {
    var simulationData = this.createSimulationData();
    var series = [{
      name: '成交量1',
      data: simulationData.data,
      format: function (val, name) {
        return val.toFixed(2) + '千';
      }
    }];
    lineChart.updateData({
      categories: simulationData.categories,
      series: series
    });
  },
  switchMode(e) {
    var mode = e.currentTarget.dataset.mode;
    this.setData({
      "isHum": mode == "hum" ? true : false,
      "isGas": mode == "gas" ? true : false,
      "isTemp": mode == "temp" ? true : false,
    })
    if(this.data.isTemp == true){
      this.setData({
        seriesName: "温度",
        unit: "℃"
      })
    }else if(this.data.isHum == true){
      this.setData({
        seriesName: "湿度",
        unit: "%"
      })
    }else if(this.data.isGas == true){
      this.setData({
        seriesName: "气体浓度",
        unit: "ppm"
      })
    }
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '每小时'+this.data.seriesName,
        data: simulationData.data,
        format: function (val, name) {
          return val.toString() + " " + that.data.unit;
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: this.data.seriesName + this.data.unit,
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 300,
      dataLabel: false,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    // 计算统计值
    var minNum = simulationData.data[0],maxNum = simulationData.data[0],aveNum = 0;
    for(var i=0;i<=currentHour;i++){
      if(minNum > simulationData.data[i]){
        minNum = simulationData.data[i];
      }
      if(maxNum < simulationData.data[i]){
        maxNum = simulationData.data[i];
      }
      aveNum +=  simulationData.data[i];
    }
    that.setData({
      minValue: minNum,
      maxValue: maxNum,
      averageValue: (aveNum / currentHour + 1).toFixed(0),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    that = this;
    //获取设备屏幕宽度
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    //获取数据
    var simulationData = this.createSimulationData();
    //绘图
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '每小时'+this.data.seriesName,
        data: simulationData.data,
        format: function (val, name) {
          return val + '℃';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: this.data.seriesName + '温度 (℃)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 300,
      dataLabel: false,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    // 计算统计值
    var minNum = simulationData.data[0],maxNum = simulationData.data[0],aveNum = 0;
    for(var i=0;i<=currentHour;i++){
      if(minNum > simulationData.data[i]){
        minNum = simulationData.data[i];
      }
      if(maxNum < simulationData.data[i]){
        maxNum = simulationData.data[i];
      }
      aveNum +=  simulationData.data[i];
    }
    that.setData({
      minValue: minNum,
      maxValue: maxNum,
      averageValue: (aveNum / currentHour + 1).toFixed(0)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})