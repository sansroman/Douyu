const net = require('net');
let addDanmu = require('./Dao').addDanmu;
let addBlacker = require('./Dao').addBlacker;

let temp =[],
    blacker_temp=[];
function Client(roomid) {
    this.roomid = roomid;
    this.buf = Buffer.alloc(0)
    this.init();
}

function replaceAll(str,search,replacement){
		if(str == null || str.length <= 0) {
			return "";
		}
	    return str.replace(new RegExp(search, 'g'), replacement);
}
function unescape(field){
    if(!field || field.length <= 0) {
        return "";
    }
    field = "" + field
    field = replaceAll(field, "@S", "/");
    field = replaceAll(field, "@A", "@");
    return field;
}
function deserialize(raw){
    var result = {};
    var kvPairs = raw.split("/");
    kvPairs.forEach(function(kvStr){
        var kv = kvStr.split("@=");
        if(kv.length != 2) {
            return;
        }
        var key = unescape(kv[0]);
        var value = unescape(kv[1]);
        if(value.indexOf("@=") >= 0) {
            value = deserialize(value);
        }
        result[key] = value;
    });
    return result;
}


Client.prototype.init = function () {
    let s = net.connect({
        port: 8601,
        host: 'openbarrage.douyutv.com'
    }, () => {
        console.log('connect success');
    });
    const msg = 'type@=loginreq/roomid@=' + this.roomid + '/';
    this.sendData(s, msg);
    s.on('data', (data) => {
        if (this.buf.length === 0) {
            this.buf = data
        } else {
            this.buf = Buffer.concat([this.buf, data])
        }
        this.formatData();
        const msg = 'type@=joingroup/rid@=' + this.roomid + '/gid@=-9999/';
        this.sendData(s, msg);
    });
    s.on('error', (err) => {
        console.log(err);
        s.destroy();
        let s = net.connect({
            port: 8601,
            host: 'openbarrage.douyutv.com'
        }, () => {
            console.log('connect success');
        });
        
    });
    setInterval(() => {
        let timestamp = parseInt(new Date() / 1000);
        let msg = 'type@=keeplive/tick@=' + timestamp + '/';
        this.sendData(s, msg);
        InsertDb();
    }, 45000);
}
Client.prototype.formatData = function () {
    while (this.buf.length > 8) {
        let len_0 = this.buf.readInt16LE(0)
        let len_1 = this.buf.readInt16LE(4)
        if (len_0 !== len_1) {
            this.buf = Buffer.alloc(0)
            return
        }
        let msg_len = len_0 + 4
        if (this.buf.length < msg_len) {
            return
        }
        let single_msg = this.buf.slice(0, msg_len)
        let single_msg_tail = single_msg[single_msg.length - 1]
        if (single_msg_tail !== 0) {
            this.buf = Buffer.alloc(0)
            return
        }
        this.buf = this.buf.slice(msg_len)
        let msg_array = single_msg.toString().match(/(type@=(chatmsg|newblackres).*?)\x00/g)
        if (msg_array) {
            msg_array.forEach(msg => {
                let test = deserialize(msg);
                filter(test);
            })
        }
    }
}
Client.prototype.formatDanmu = function (msg) {
    let map = {};
    msg = msg.replace(/\\/g, '')
    msg = debackslashify(msg);
    try {
        map = JSON.parse(msg)        
    } catch (error) {
        console.log(error);
        console.log(msg);
    }

    return map;

}

Client.prototype.sendData = function (s, msg) {
    let data = new Buffer(msg.length + 13);
    data.writeInt32LE(msg.length + 9, 0);
    data.writeInt32LE(msg.length + 9, 4);
    data.writeInt32LE(689, 8);
    data.write(msg + '\0', 12);
    s.write(data);
}







function filter(map) {
    if (map.type == "chatmsg") chatmsg(map)
    else if (map.type == "newblackres") blackmsg(map)
}

function chatmsg(data) {
    temp.push([data.rid, data.uid, data.nn, data.txt, new Date().getTime()]);
}

function blackmsg(data) {
    if (data.rid == 154537) blacker_temp.push([data.sid, data.did, data.snic, data.dnic, data.endtime]);
}

function InsertDb() {
    //插入数据库
    for (let index in temp) {
        addDanmu(temp[index]);
    }
    for (let index in blacker_temp) {
        addBlacker(blacker_temp[index]);        
    }
    blacker_temp = [];
    temp = [];
}

var escapes = { // Escapement translation table  
    '\\' : '\\',  
    '"' : '"',  
    '/' : '/',  
    't' : '\t',  
    'n' : '\n',  
    'r' : '\r',  
    'f' : '\f',  
    'b' : '\b'  
};  
function debackslashify(text) {  
    // Remove and replace any backslash escapement.  
    return text.replace(/\\(?:u(.{4})|([^u]))/g, function(a, b, c) {  
                return b ? String.fromCharCode(parseInt(b, 16)) : escapes[c];  
            });  
}

module.exports = Client;
