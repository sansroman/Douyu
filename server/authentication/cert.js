let le = require('greenlock').create({server:'staging'});

let opts = {
    domains:['dys.roccat.top'],
    email:'tboevil@gmail.com',
    agreeTos:true
}
le.register(opts).then(function(certs){
    console.log(certs);
},function(err){
    console.log(err);
})