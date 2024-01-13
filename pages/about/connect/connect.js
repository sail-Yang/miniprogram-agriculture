const app = getApp();
var tcp = app.globalData.tcp;
var that;
Component({
  data: {
    /*连接参数 */
    ipAddress: app.globalData.ipAddress,
    port: app.globalData.port,
    timeout: '10',
    /*连接状态 */
    connectLoading: false,
    noCanClickConnectBtton: false,
    isConnected: app.globalData.isConnected
  },
  methods: {
    updateIpAddress(e) {
      this.setData({
        "ipAddress": e.detail.value,
      })
      app.globalData.ipAddress = e.detail.value;
    },
    updatePort(e) {
      this.setData({
        "port": e.detail.value,
      })
      app.globalData.port = e.detail.value;
    },
    //当小程序和开发板连接成功时触发
    onSockConnect: function () {
      that.setData({
        "connectLoading": false,
        "noCanClickConnectBtton": false,
      })
      //更新全局缓存为已连接
      // wx.setStorageSync("isConnected",true);
      //更新全局变量isConnected为已连接
      app.globalData.isConnected = true;
      that.setData({
        "isConnected": app.globalData.isConnected,
      })
      setTimeout(() => {
        wx.showToast({
          title: '连接成功',
          icon: 'success',
        })
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);
      tcp.write('111111111111');
      console.log("执行connect.js里的onSocketConnect");
    },
    //当socket报错时
    onSockError: function (msg) {
      if(msg.errMsg != "Error: read ECONNRESET"){
        that.setData({
          "connectLoading": false,
          "noCanClickConnectBtton": false,
        })
        //修改全局状态和本地状态为未连接
        app.globalData.isConnected = false;
        that.setData({
          "isConnected": app.globalData.isConnected,
        })
        setTimeout(() => {
          wx.showToast({
            title: '连接失败',
            icon: 'error',
          })
          setTimeout(() => {
            wx.hideToast();
          }, 2000)
        }, 0);
        console.log(msg.errMsg);
      }
    },
    testConnectDeviceByTCP() {
      this.setData({
        "connectLoading": true,
        "noCanClickConnectBtton": true,
      })
      tcp.connect({
        address: this.data.ipAddress,
        port: this.data.port,
        timeout: this.data.timeout
      });
    },
    //当板子有消息传来时
    onSockMessage: function (msg) {
      let msgView = new DataView(msg.message);
      let buffer = msgView.buffer
      const string = String.fromCharCode.apply(null, new Uint8Array(buffer))
      console.log(string);
    },
    delayedFunction() {
      console.log("这条消息会在 2000 毫秒后显示");
    }
  },
  lifetimes: {
    attached: function(options) {
      //绑定事件函数
      tcp.onError(this.onSockError);
      tcp.onMessage(this.onSockMessage);
      tcp.onConnect(this.onSockConnect);
      that = this;
      this.setData({
        "isConnected": app.globalData.isConnected,
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      tcp.offError(this.onSockError);
      tcp.offMessage(this.onSockMessage);
      tcp.offConnect(this.onSockConnect);
    },
  }
})