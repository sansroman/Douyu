let fs = require('fs');
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
    cert: fs.readFileSync('./sslcert/fullchain.pem'),
    key: fs.readFileSync('./sslcert/privkey.pem')
  }
}
