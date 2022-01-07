var http = require('http');
var {app, io} = require("./backend/app"); 
const port = 3000;

var server = http.createServer(app);

app.set('port', port);

io.attach(server);

server.listen(port); 

