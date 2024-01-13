var currentHour = new Date().getHours();
// app.js
var tcp = wx.createTCPSocket();
var that;
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 设置全局的数据缓存
    // 24小时的数据缓存
    currentHour = new Date().getHours();
    this.globalData.tcp = tcp;
    var dataList = new Array(24);
    for (var i = 0; i < 24; i++) {
      dataList[i] = {
        "temp": Math.floor(Math.random() * (28 - 25 + 1)) + 25,
        "hum": Math.floor(Math.random() * (40 - 36 + 1)) + 36,
        "gas": Math.floor(Math.random() * (1265 - 1255 + 1)) + 1255,
        "light": Math.floor(Math.random() * (126 - 120 + 1)) + 120,
        "flag": false
      }
    }
    this.globalData.warningNum = 0;
    if(dataList[currentHour].temp < this.globalData.minTemp || dataList[currentHour].temp > this.globalData.maxTemp){
      this.globalData.warningNum++;
    }
    if(dataList[currentHour].hum < this.globalData.minHum || dataList[currentHour].temp > this.globalData.maxHum){
      this.globalData.warningNum++;
    }
    if(dataList[currentHour].gas < this.globalData.minGas || dataList[currentHour].gas > this.globalData.maxGas){
      this.globalData.warningNum++;
    }
    this.globalData.dataList = dataList;
    that = this;
    tcp.onMessage(this.onSockMessage);
    tcp.onConnect(this.onSockConnect);
    tcp.onError(this.onSockError);
    setInterval(
      function () {
        // TODO 你需要无限循环执行的任务
        tcp.connect({
          address: that.globalData.ipAddress,
          port: that.globalData.port,
          timeout: 10
        });
      }, 5000);
  },
  globalData: {
    userInfo: null,
    isConnected: false,
    ipAddress: "192.168.137.47",
    port: "5001",
    dataList: "",
    tcp: "",
    warningNum: "0",
    // 预警值
    maxTemp: "28",
    minTemp: "27",
    maxHum: "60",
    minHum: "10",
    maxGas: "1250",
    minGas: "1000",
    peopleSwitch: false
  },
  onSockError: function(msg) {
    if(msg.errMsg != "Error: read ECONNRESET"){
      //修改全局状态和本地状态为未连接
      that.globalData.isConnected = false;
      console.log(msg.errMsg);
    }
  },
  //当小程序和开发板连接成功时触发
  onSockConnect: function () {
    //更新全局变量isConnected为已连接
    that.globalData.isConnected = true;
    var person = that.globalData.peopleSwitch == true ? 1 : 0;
    tcp.write('btn_person:'+ person + ',tem_nor_low:'+ that.globalData.minTemp + ',tem_nor_high:' + that.globalData.maxTemp + ',hum_nor_low:' + that.globalData.minHum + ',hum_nor_high:' + that.globalData.maxHum);
    // tcp.write('btn_person:1,tem_nor_low:'+'0,tem_nor_high:40,hum_nor_low:10,hum_nor_high:60');
    console.log("执行app.js里的onSocketConnect");
  },
  //当板子有消息传来时
  onSockMessage: function (msg) {
    let msgView = new DataView(msg.message);
    let buffer = msgView.buffer
    const string = String.fromCharCode.apply(null, new Uint8Array(buffer))
    var dataJson = JSON.parse(string);
    var dataList= that.globalData.dataList;
    currentHour = new Date().getHours();
    dataList[parseInt(currentHour)] = {
      "temp": dataJson.temp,
      "hum": dataJson.hum,
      "gas": dataJson.gas,
      "light": dataJson.light,
      "flag": true
    };
    that.globalData.dataList = dataList;
    
  }
})