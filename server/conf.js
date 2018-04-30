let fs = require('fs');
let path = require('path');
module.exports = {
  db: {
    mysql: {

      host: '127.0.0.1',
      user: 'dys',
      password: '123456',
      database: 'dys'
    }
  },
  certOpts:{
<<<<<<< HEAD
    cert: fs.readFileSync(path.join('./sslcert/fullchain.pem')),
    key: fs.readFileSync(path.join('./sslcert/privkey.pem'))
  }
=======
    cert: fs.readFileSync(path.join(process.cwd(),'./sslcert/fullchain.pem')),
    key: fs.readFileSync(path.join(process.cwd(),'./sslcert/privkey.pem'))  
}
>>>>>>> abc4220baf447d1dcac5e75c1e28bfdb6613bcd9
}
