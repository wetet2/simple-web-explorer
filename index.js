var path = require('path');
var fs = require('fs');
if(!fs.existsSync(path.resolve(__dirname, 'server/config.js'))){
    console.log('=====================');
    console.log('Copy server/config.default.js to config.js in the same folder and modify config.js with your information.')
    console.log('=====================');
    process.exit(1);
}

require('./server/nodeArgs');
var app = require('./server/app');
var http = require('http');
var config = require('./server/config');
var port = process.nodeArgs.port || config.port || 80;

app.set('port', port);
var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') throw error;
    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

