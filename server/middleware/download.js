let superagent = require('superagent');
let fs = require('fs');
let log4js = require('log4js');
log4js.configure({
  appenders: {
    access: {
      type: 'DateFile',
      filename: 'logs/access.log',
      pattern:'-yyyy-MM-dd.log',
      alwaysIncludePattern:true,
      category:'access',
      maxLogSize: 10 * 1024 * 1024
    },
    normal: {
      type: 'file',
      filename: 'logs/normal.log',
      maxLogSize: 1024 * 1024
    },
    console:{type:'console'}
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'trace'
    },
    normal:{
      appenders:['normal'],
      level:'info'
    },
    access:{
      appenders:['access'],
      level:'debug'
    }
  }
})
const logger = log4js.getLogger('normal');
const logger_access = log4js.getLogger('access');

// const dys =  "http://livestream.plu.cn/live/getlivePlayurl?roomId=&v2"
// const folder = "./Video/dys";
// let index = 0;
// let complatedSize = 0;
// let sign = false;
// let times = 0;
// const DISCONNECTION_TIMEOUT = 10 * 1000;
// const CHECK_DELAY = 5 * 60 * 1000;

function DownObject(roomId) {
  this.roomId = roomId;
  this.init();
}
DownObject.prototype.init = function () {

  this.index = 0;
  this.complatedSize = 0;
  this.sign = false;
  this.times = 0;
  this.DISCONNECTION_TIMEOUT = 10 * 1000;
  this.CHECK_DELAY = 5 * 60 * 1000;
  this.url = "http://livestream.plu.cn/live/getlivePlayurl?roomId=" + this.roomId + "&v2";

}

DownObject.prototype.configure = function (folder) {
  this.folder = folder;

}


DownObject.prototype.checkLived = function (callback) {
  let self = this;
  console.log("正在检测");
  superagent.get(this.url)
    .set('accept', 'json')
    .end((err, res) => {
      logger_access.trace(res);
      if (typeof (res.body.liveUrl) === 'string') {
        console.log("正在直播");
        callback(self, res.body.playLines[0].urls);
      }
    })
}
//apply this方法失效,临时补救办法
DownObject.prototype.filterUrl = function (self, urls) {

  let tempArr = [];
  urls.forEach(element => {
    if (element.ext == "flv" && element.resolution == "1920x1080") tempArr.push(element.securityUrl);
  });
  self.sign = true;
  self.downloadFlv(tempArr);
}



DownObject.prototype.downloadFlv = function (urlList) {
  let fileName = this.getCurTime() + "_" + this.times;
  var writeStream = fs.createWriteStream(this.folder + fileName + ".flv");
  writeStream.on('close', function () {
    console.log("下载结束...");
    this.sign = false;
  })
  writeStream.on('error', function (err) {
    console.log(err)
  });
  let timer = setInterval(() => {
    if (this.checkEnd(writeStream.bytesWritten)) {
      writeStream.end();
      logger.warn("下载文件过小...");
      this.reload(urlList);
    } else {
      logger.info("size:" + writeStream.bytesWritten + " ,this.complatedSize:" + this.complatedSize);
      this.complatedSize = writeStream.bytesWritten;
    }
  }, this.DISCONNECTION_TIMEOUT);

  var req = superagent.get(urlList[this.index])
  req.pipe(writeStream);

}

DownObject.prototype.checkEnd = function (size) {
  if (size > this.complatedSize + 10000) return false;
  else return true;
}

DownObject.prototype.reload = function (urlList) {
  logger.info("正在尝试重连...")
  this.index++;
  this.times++;
  console.log(this.index)
  if (this.index >= urlList.length - 1) {
    this.index = 0;
    this.start();
  } else this.downloadFlv(urlList);
}

DownObject.prototype.getCurTime = function () {
  let tempDate = new Date();
  let date = tempDate.getDate() > 9 ? tempDate.getDate() : "0" + tempDate.getDate();
  let month = tempDate.getMonth() > 9 ? tempDate.getMonth() : "0" + tempDate.getMonth();
  let year = tempDate.getFullYear().toString();
  return year + month + date;
}

DownObject.prototype.start = function (roomUrl) {
  this.checkLived(this.filterUrl);
  let checkTimer = setInterval(() => {
    if (this.sign == false) this.checkLived(this.filterUrl);
  }, this.CHECK_DELAY);
}

let dys = new DownObject("2241164");
dys.configure("./Video/dys");
dys.start();
