var ranaly = require('node_ranaly');
var client = ranaly.createClient(6379,"localhost");
var query = new client.Amount('Query');
var users = new client.Amount('Users');
var appear = new client.Amount('Appear');
var mute = new client.Amount('Mute');
let statistics = {
    query,
    users,
    appear,
    mute
}
module.exports =statistics;