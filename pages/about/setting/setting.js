// pages/about/setting/setting.js
const app = getApp();
var tcp = app.globalData.tcp;
var that
Page({
  /**
   * 页面的初始数据
   */
  data: {
    maxTemp: app.globalData.maxTemp,
    minTemp: app.globalData.minTemp,
    maxHum: app.globalData.maxHum,
    minHum: app.globalData.minHum,
    maxGas: app.globalData.maxGas,
    minGas: app.globalData.minGas,
    peopleSwitch: app.globalData.peopleSwitch,
  },
  /*恢复最大预警值为默认值 */
  cleanMaxValue(e) {
    var mode = e.currentTarget.dataset.mode;
    if(mode == 'temp'){
      this.setData({
        maxTemp: app.globalData.maxTemp,
      })
    }else if(mode == 'hum'){
      this.setData({
        maxHum: app.globalData.maxHum,
      })
    }else if(mode == 'gas'){
      this.setData({
        maxGas: app.globalData.maxGas,
      })
    }
  },
  /*恢复最小预警值为默认值 */
  cleanMinValue(e) {
    var mode = e.currentTarget.dataset.mode;
    if(mode == 'temp'){
      this.setData({
        minTemp: app.globalData.minTemp,
      })
    }else if(mode == 'hum'){
      this.setData({
        minHum: app.globalData.minHum,
      })
    }else if(mode == 'gas'){
      this.setData({
        minGas: app.globalData.minGas,
      })
    }
  },
  /*温度加1 */
  incTempValue(e){
    var mode = e.currentTarget.dataset.mode;
    if(mode == 'max'){
      this.setData({
        maxTemp: parseInt(this.data.maxTemp)+1,
      })
    }else{
      this.setData({
        minTemp: parseInt(this.data.minTemp)+1,
      })
    }
  },
  /*温度减1 */
  decTempValue(e){
    var mode = e.currentTarget.dataset.mode;
    if(mode == 'max'){
      this.setData({
        maxTemp: parseInt(this.data.maxTemp)-1,
      })
    }else{
      this.setData({
        minTemp: parseInt(this.data.minTemp)-1,
      })
    }
  },
  inputTemp(e){
    var mode = e.currentTarget.dataset.mode;
    if(mode == 'max'){
      this.setData({
        maxTemp: parseInt(e.detail.value),
      })
    }else{
      this.setData({
        minTemp: parseInt(e.detail.value),
      })
    }
  },
  /*湿度加1 */
  incHumValue(e){
    var mode = e.currentTarget.dataset.mode;
    if(mode == 'max'){
      this.setData({
        maxHum: parseInt(this.data.maxHum)+1,
      })
    }else{
      this.setData({
        minHum: parseInt(this.data.minHum)+1,
      })
    }
  },
  /*温度减1 */
  decHumValue(e){
    var mode = e.currentTarget.dataset.mode;
    if(mode == 'max'){
      this.setData({
        maxHum: parseInt(this.data.maxHum)-1,
      })
    }else{
      this.setData({
        minHum: parseInt(this.data.minHum)-1,
      })
    }
  },
  inputHum(e){
    var mode = e.currentTarget.dataset.mode;
    if(mode == 'max'){
      this.setData({
        maxHum: parseInt(e.detail.value),
      })
    }else{
      this.setData({
        minHum: parseInt(e.detail.value),
      })
    }
  },
  /*气体加1 */
  incGasValue(e){
    var mode = e.currentTarget.dataset.mode;
    if(mode == 'max'){
      this.setData({
        maxGas: parseInt(this.data.maxGas)+1,
      })
    }else{
      this.setData({
        minGas: parseInt(this.data.minGas)+1,
      })
    }
  },
  /*温度减1 */
  decGasValue(e){
    var mode = e.currentTarget.dataset.mode;
    if(mode == 'max'){
      this.setData({
        maxGas: parseInt(this.data.maxGas)-1,
      })
    }else{
      this.setData({
        minGas: parseInt(this.data.minGas)-1,
      })
    }
  },
  inputGas(e){
    var mode = e.currentTarget.dataset.mode;
    if(mode == 'max'){
      this.setData({
        maxGas: parseInt(e.detail.value),
      })
    }else{
      this.setData({
        minGas: parseInt(e.detail.value),
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      maxTemp: app.globalData.maxTemp,
      minTemp: app.globalData.minTemp,
      minGas: app.globalData.minGas,
      maxGas: app.globalData.maxGas,
      minHum: app.globalData.minHum,
      maxHum: app.globalData.maxHum,
      peopleSwitch: app.globalData.peopleSwitch
    })
    tcp.onConnect(this.onSockConnect);
    that = this;
  },
  onSockConnect: function () {
    //更新全局变量isConnected为已连接
    console.log("执行setting.js里的onSocketConnect");
    app.globalData.isConnected = true;
    var person = that.data.peopleSwitch == true ? 1 : 0;
    tcp.write('btn_person:'+ person + ',tem_nor_low:'+ that.data.minTemp + ',tem_nor_high:' + that.data.maxTemp + ',hum_nor_low:' + that.data.minHum + ',hum_nor_high:' + that.data.minHum);
    app.globalData.minTemp = this.data.minTemp;
    app.globalData.maxTemp = this.data.maxTemp;
    app.globalData.minHum = this.data.minHum;
    app.globalData.maxHum = this.data.maxHum;
    app.globalData.minGas = this.data.minGas;
    app.globalData.maxGas = this.data.maxGas;
    app.globalData.peopleSwitch = this.data.peopleSwitch;
    setTimeout(() => {
      wx.showToast({
        title: '保存成功',
        icon: 'success',
      })
      setTimeout(() => {
        wx.hideToast();
      }, 2000)
    }, 0);
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
    tcp.offConnect(this.onSockConnect);
    console.log("app max temp:" + app.globalData.maxTemp);
    console.log("this max temp:" + this.data.maxTemp);
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

  },
  //人体感应开关
  buzzerSwitch(event){
    
    this.setData({
      peopleSwitch: event.detail.value,
    })
    // console.log("人体感应是否打开", this.data.peopleSwitch); 
  },
  saveSettings(){
    console.log("app max temp:" + app.globalData.maxTemp);
    console.log("this max temp:" + this.data.maxTemp);
    tcp.connect({
      address: app.globalData.ipAddress,
      port: app.globalData.port,
      timeout: 10
    });
    
  }
})