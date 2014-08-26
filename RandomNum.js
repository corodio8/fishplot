//this should listen on a port and return a list of random [x,y] points.
function Server() {
    this.runServer();
    thisServer = this
}

Server.PORT = 8998;
Server.ADDRESS = '172.31.31.213';
Server.NUM_PTS = 20;
Server.RANGE = 10;

Server.prototype.runServer = function() {
    var http = require('http');
    var randomArray = this.generateRandomPts(Server.NUM_PTS, Server.RANGE);
    http.createServer(function (req, res) {
        //res.writeHead(200, {'Content-Type': 'text/plain'});
        //res.end(randomArray.toString());
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(thisServer.generateRandomPts(Server.NUM_PTS, Server.RANGE)));
    }).listen(Server.PORT, Server.ADDRESS);
    console.log('Server running at ' + Server.ADDRESS + ':' + Server.PORT)
}

Server.prototype.generateRandomPts = function(number, range) {
    var pointSet = [];
    for ( var i = 0; i < number; i++ ) {
        var xCoord = (Math.random() * range);
        var yCoord = (Math.random() * range);
        pointSet.push({x: xCoord, y: yCoord});
    }
    return pointSet;
}

new Server();
