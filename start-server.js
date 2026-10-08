// Launcher: starts the backend server from project root
process.chdir(__dirname + '/server')
require('./server/server.js')
