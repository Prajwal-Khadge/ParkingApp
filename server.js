var http = require('http');
var app = require("./backend/app"); 
const port = 3000;

var server = http.createServer(app);

app.set('port', port);

server.listen(port); 