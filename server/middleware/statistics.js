var ranaly = require('node_ranaly');
var client = ranaly.createClient(6379,"localhost");
var query = new client.Amount('Query');
var users = new client.Amount('Users');
var appear = new client.Amount('Appear');
var mute = new client.Amount('Mute');
var mute = new client.Amount('Total');

let statistics = {
    query,
    users,
    appear,
    mute,
    total
}
module.exports =statistics;