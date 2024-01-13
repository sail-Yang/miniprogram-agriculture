// index.js
const app = getApp();
const tcp = app.globalData.tcp
var currentHour = new Date().getHours();
var that;
Component({
  data: {
    /*连接参数 */
    ipAddress: app.globalData.ipAddress,
    port: app.globalData.port,
    timeout: '10',
    warningNum: app.globalData.warningNum,
    dataList: [{
        id: 'temp',
        name: '环境温度',
        value: app.globalData.dataList[currentHour].temp,
        unit: '℃',
        image: '/assets/images/temperature.png',
        highThreshold: app.globalData.maxTemp,
        lowThreshold: app.globalData.minTemp
      },
      {
        id: 'hum',
        name: '环境湿度',
        value: app.globalData.dataList[currentHour].hum,
        unit: '%',
        image: '/assets/images/humidity.png',
        highThreshold: app.globalData.maxHum,
        lowThreshold: app.globalData.minHum
      },
      {
        id: 'gas',
        name: '气体浓度',
        value: app.globalData.dataList[currentHour].gas,
        unit: 'ppm',
        image: '/assets/images/pressure.png',
        highThreshold: app.globalData.maxGas,
        lowThreshold: app.globalData.minGas
      },
      {
        id: 'light',
        name: '光照强度',
        value: app.globalData.dataList[currentHour].light,
        unit: 'Lux',
        image: '../../assets/images/light.png',
        highThreshold: '125',
        lowThreshold: '0'
      },
      {
        id: 'windspeed',
        name: '瞬时风速',
        value: '2',
        unit: 'm/s',
        image: '/assets/images/windspeed.png',
        highThreshold: '35',
        lowThreshold: '0'
      },
      {
        id: 'winddirection',
        name: '风向',
        value: '北风',
        unit: '',
        image: '/assets/images/wind.png',
        highThreshold: '35',
        lowThreshold: '0'
      }
    ],
    tem: -5,
    tem_low: 0,
    tem_high: 40,
    hum: 40,
    hum_low: 10,
    hum_high: 80,
  },

  methods: {
    gotoSetting() {
      wx.navigateTo({
        url: '../about/setting/setting',
      })
    },
    gotoDataReview() {
      wx.navigateTo({
        url: '../datareview/datareview',
      })
    },
    //当板子有消息传来时
    onSockMessage1: function (msg) {
      that.setData({
        'dataList[0].value': app.globalData.dataList[currentHour].temp,
        'dataList[1].value': app.globalData.dataList[currentHour].hum,
        'dataList[2].value': app.globalData.dataList[currentHour].gas,
        'dataList[3].value': app.globalData.dataList[currentHour].light,
        'dataList[0].highThreshold': app.globalData.maxTemp,
        'dataList[0].lowThreshold' : app.globalData.minTemp,
        'dataList[1].highThreshold': app.globalData.maxHum,
        'dataList[1].lowThreshold' : app.globalData.minHum,
        'dataList[2].highThreshold': app.globalData.maxGas,
        'dataList[2].lowThreshold' : app.globalData.minGas,
      })
    }
  },
  lifetimes: {
    attached: function (options) {
      //绑定事件函数
      tcp.connect({
        address: app.globalData.ipAddress,
        port: app.globalData.port,
        timeout: 10
      });
      tcp.onMessage(this.onSockMessage1);
      that = this;
    },
    detached: function (options) {
      tcp.offMessage(this.onSockMessage1);
    }
  }
})