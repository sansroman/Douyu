/*
 *      TODO:
 *          1. 修改筛选代码,在接受到信息类型后直接筛选
 *          2. 追踪错误信息,完善日志记录
 *       
 * 
 */












const addDanmu = require('./Dao').addDanmu;
const addBlacker = require('./Dao').addBlacker;
let index_text = 0;
let log4js = require('log4js');
log4js.configure({
  appenders: {
    access: {
      type: 'DateFile',
      filename: 'logs/debug.log',
      pattern:'-yyyy-MM-dd.log',
      alwaysIncludePattern:true,
      category:'access',
      maxLogSize: 10 * 1024 * 1024
    },
    console:{type:'console'}
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'trace'
    },
    debug:{
      appenders:['access'],
      level:'debug'
    }
  }
})

const logger = log4js.getLogger('debug');


const ws = require('ws')
const events = require('events')
const request = require('request-promise')
const socks_agent = require('socks-proxy-agent')

const timeout = 30000
const fresh_gift_interval = 60 * 60 * 1000
const r = request.defaults({ json: true, gzip: true, timeout: timeout })

class longzhu_danmu extends events {
    constructor(opt) {
        super()
        if (typeof opt === 'string')
            this._roomid = opt
        else if (typeof opt === 'object') {
            this._roomid = opt.roomid
            this.set_proxy(opt.proxy)
        }
    }

    set_proxy(proxy) {
        this._agent = new socks_agent(proxy)
    }

    async _get_gift_info() {
        try {
            let gift_info = {}
            let body = await r({
                url: 'http://configapi.plu.cn/item/getallitems',
                agent: this._agent
            })
            body.forEach(item => {
                gift_info[item.name] = { name: item.title, price: item.costValue * 100, type: item.costType }
            })
            return gift_info
        } catch (e) { }
    }

    async _get_room_uid() {
        try {
            const body = await r({
                url: `http://m.longzhu.com/${this._roomid}`,
                agent: this._agent
            })
            const uid_array = body.match(/var roomId = (\d+);/)
            return uid_array[1]
        } catch (e) {
            this.emit('error', new Error('Fail to get room id'))
        }
    }

    async _fresh_gift_info() {
        const gift_info = await this._get_gift_info()
        if (!gift_info) return this.emit('error', new Error('Fail to get gift info'))
        this._gift_info = gift_info
    }

    async start() {
        if (this._starting) return
        this._connect_count = 0
        this._starting = true
        this._uid = this._uid || await this._get_room_uid()
        if (!this._uid) return this.emit('close')
        this._gift_info || await this._fresh_gift_info()
        if (!this._gift_info) return this.emit('close')
        this._fresh_gift_info_timer = setInterval(this._fresh_gift_info.bind(this), fresh_gift_interval);
        this._start_ws_chat()
        this._start_ws_other()
    }

    _start_ws_chat() {
        this._client_chat = new ws(`ws://mbgows.plu.cn:8805/?room_id=${this._uid}&batch=1&group=0&connType=1`, {
            perMessageDeflate: false,
            agent: this._agent
        })
        this._client_chat.on('error', err => {
            this.emit('error', err)
        })
        this._client_chat.on('open', this._on_connect.bind(this))
        this._client_chat.on('close', this._stop.bind(this))
        this._client_chat.on('message', this._on_msg.bind(this))
    }

    _start_ws_other() {
        this._client_other = new ws(`ws://mbgows.plu.cn:8805/?room_id=${this._uid}&batch=1&group=0&connType=2`, {
            perMessageDeflate: false,
            agent: this._agent
        })
        this._client_other.on('error', err => {
            this.emit('error', err)
        })
        this._client_other.on('open', this._on_connect.bind(this))
        this._client_other.on('close', this._stop.bind(this))
        this._client_other.on('message', this._on_msg.bind(this))
    }

    _on_connect() {
        if (++this._connect_count === 2) this.emit('connect')
    }

    _on_msg(msg) {
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

    _parse_time(msg) {
        try {
            const time_array = msg.msg.time.match(/Date\((\d+)/)
            return parseInt(time_array[1])
        } catch (e) {
            return new Date().getTime()
        }
    }

    _build_chat(msg) {
        let plat = 'pc_web'
        if (msg.msg.via === 2) {
            plat = 'android'
        } else if (msg.msg.via === 3) {
            plat = 'ios'
        }
        return {
            type: 'chat',
            time: this._parse_time(msg),
            from: {
                name: msg.msg.user.username,
                rid: msg.msg.user.uid + '',
                level: msg.msg.user.newGrade,
                plat: plat
            },
            id: msg.id + '',
            content: msg.msg.content
        }
    }

    _build_gift(msg) {
        const gift = this._gift_info[msg.msg.itemType] || {}
        let msg_obj = {
            type: 'gift',
            time: this._parse_time(msg),
            name: gift.name || '未知礼物',
            from: {
                name: msg.msg.user.username,
                rid: msg.msg.user.uid,
                level: msg.msg.user.newGrade,
            },
            id: msg.id + '',
            count: msg.msg.number,
            price: msg.msg.number * (gift.price || 0),
            earn: msg.msg.number * (gift.price || 0) * 0.01
        }
        if (gift.type !== 1) {
            msg_obj.type = 'longdou'
            delete msg_obj.price
            delete msg_obj.earn
        }
        return msg_obj
    }

    _format_msg(msg) {
        let msg_obj
        switch (msg.type) {
            case 'chat':
                msg_obj = this._build_chat(msg)
                this.emit('message', msg_obj)
                break;
            case 'gift':
                msg_obj = this._build_gift(msg)
                this.emit('message', msg_obj)
                break
        }
    }

    async _stop() {
        if (!this._starting) return
        this._starting = false
        clearInterval(this._fresh_gift_info_timer)
        this._client_chat && this._client_chat.terminate()
        this._client_other && this._client_other.terminate()
        this.emit('close')
    }

    stop() {
        this.removeAllListeners()
        this._stop()
    }

}



function ListenRoom(roomarr) {
    this.clients = [];
    this.roomarr =roomarr;
    this.temp = [];
}
ListenRoom.prototype.start= function(){
    this.roomarr.forEach((element,index)=>{
        this.clients[index] = new longzhu_danmu(element);
        this.clients[index].on('message',msg=>{if(msg.type==="chat")this.save(msg)});
        this.clients[index].on('error',e=>{logger.debug(e);this.clients[index].start()});
        this.clients[index].start();     
    })
    setInterval(() => {
        for(let index in this.temp){
            addDanmu(this.temp[index])
            index_text++;
        }
        this.temp = [];
    }, 45000);    
    
}
ListenRoom.prototype.save = function(msg){
    this.temp.push([msg.raw.msg.RoomId,msg.from.rid,msg.from.name,msg.content,msg.time])
}

module.exports = ListenRoom;
