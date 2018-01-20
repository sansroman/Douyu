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
    cert: fs.readFileSync(path.join(process.cwd(),'/sslcert/fullchain.pem')),
    key: fs.readFileSync(path.join(process.cwd(),'/sslcert/privkey.pem'))
  }
}
