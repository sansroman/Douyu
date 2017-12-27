var ranaly = require('node_ranaly');
var client = ranaly.createClient(6379,"localhost");
var query = new client.Amount('Query');
var users = new client.Amount('Users');

let statistics = {
    query,
    users
}
module.exports =statistics;