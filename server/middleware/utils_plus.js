/*
 *
 * TODO:
 *      1. 多线程websocket绑定机制 
 *      2. 错误追踪,日志记录
 *      3. 捕获处理错误,提供稳定性
 *      4. 性能优化
 * 
 */



//  引入模块
const addDanmu = require('./Dao').addDanmu,
  addBlacker = require('./Dao').addBlacker,
  log4js = require('log4js'),
  ws = require('ws'),
  events = require('events'),
  request = require('request-promise'),
  socksAgent = require('socks-proxy-agent');

//  初始化配置
const logger = log4js.getLogger('debug'),
  timeout = 30000,
  fresh_gift_interval = 60 * 60 * 1000,
  r = request.defaults({
    json: true,
    gzip: true,
    timeout: timeout
  });

class DanmuListener extends events {
  constructor(opt) {
    super()
    if (opt instanceof Array) {
      this._roomidList = opt
    } else if (typeof opt === 'object') {
      this._roomidList = opt.roomidList
      this.set_proxy(opt);
    }
  }
  // 需要完善多房间代理
  set_proxy(proxy) {
    this._agent = new socksAgent(proxy);
  }
  async start(){
      this._clientList = [];
      this._uidList = await this._get_room_uid();
      this._start_ws_chats();
  }
  async _get_room_uid() {
    try {
      let uid_array = [];
      for (let i = 0; i < this._roomidList.length; i++) {
        const element = this._roomidList[i];
        let body = await r({
          url: `http://m.longzhu.com/${element}`,
          agent: this._agent
        })
        let item = body.match(/var roomId = (\d+);/)[1];
        uid_array.push(item);
      }
      console.log(uid_array)
      return uid_array
    } catch (error) {
      this.emit('error', new Error('Fail to get room id'))
    }
  }
  _start_ws_chats() {
    this._uidList.forEach((element,index) => {
      this._clientList.push(new ws(`ws://mbgows.plu.cn:8805/?room_id=${element}&batch=1&group=0&connType=1`, {
        perMessageDeflate: false,
        agent: this._agent
      }));
      this._clientList[index].on('error', err => {
        this.emit('error', err)
      })
      this._clientList[index].on('open', this._on_connect.bind(this))
      this._clientList[index].on('close', this._stop.bind(this))
      this._clientList[index].on('message', this._on_msg.bind(this))

    });
  }
  _on_connect(){
     this.emit('connect');
  }
  _on_msg(msg){
    try {
        msg = JSON.parse(msg)
        if (msg instanceof Array) {
            msg.forEach((m) => {
                this._format_msg(m)
            })
        } else {
            this._format_msg(msg)
        }
    } catch (e) {
        this.emit('error', e)
    }
  }

  _format_msg(msg){
      console.log(msg);

  }
  _stop(){

  }

}

let longzhu = new DanmuListener(['777777', 'y198888','m193053']);

longzhu.start();
