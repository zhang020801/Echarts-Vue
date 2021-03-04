export default class SocketService {
  static instance = null
  static get Instance(){
    if(!this.instance){
      this.instance = new SocketService()
    }
    return this.instance
  }
  ws = null;
  callBackMapping = {};

  connected = false;
  sendRetryCount = 0;
  connectRetryCount = 0;

  connect() {
    if (!window.WebSocket) {
      return console.log("您的浏览器不支持WebSocket")
    }
    this.ws = new WebSocket('ws://localhost:9998');

    //连接成功的事件
    this.ws.onopen = () => {
      console.log('连接服务端成功');
      this.connected = true;
      this.connectRetryCount = 0;
    };
    //连接失败的事件
    this.ws.onclose = () => {
      console.log('连接服务端失败');
      this.connected = false;
      this.connectRetryCount++;
      setTimeout(() => {
        this.connect()
      },this.connectRetryCount * 500)
    };
    //得到服务端发送过来的数据
    this.ws.onmessage = (msg) => {
      console.log('从服务端获取到了数据')
      // console.log(msg.data);
      const recvData = JSON.parse(msg.data);
      const socketType = recvData.socketType;
      if(this.callBackMapping[socketType]){
        const action = recvData.action;
        if(action === 'getData'){
          const realData = JSON.parse(recvData.data);
          this.callBackMapping[socketType].call(this,realData)
        }else if(action === 'fullScreen'){

        }else if (action === 'themeChange'){

        }
      }
    }


  }
  //回调函数的注册
  registerCallBack(socketType,callBack){
    this.callBackMapping[socketType] = callBack
  }
  //取消某一个回调函数
  unRegisterBack(socketType){
    this.callBackMapping[socketType] = null
  }
  //发送数据的方法
  send(data){
    if(this.connected){
      this.sendRetryCount = 0;
      this.ws.send(JSON.stringify(data))
    }else {
      this.sendRetryCount++;
      setTimeout(() => {
        this.send(data)
      },this.sendRetryCount * 500)
    }

  }
}
