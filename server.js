var express = require("express");
var path = require("path");
var session = require('express-session');
var bcrypt = require('bcrypt');
// create the express app
var app = express();
// require bodyParser since we need to handle post data for adding a user
app.use(session({secret:'shhhhhhhbasdkfakdnfkadnflk'}));
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// static content 
app.use(express.static(path.join(__dirname, "./musicroom/dist")));
// setting up ejs and our views folder
require('./server/config/mongoose');

var routes_setter = require('./server/config/routes.js');
// invoke the function stored in routes_setter and pass it the "app" variable
routes_setter(app);
// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
  console.log("listening on port 8000");
 });
var savedMessages = [];
var io = require('socket.io').listen(server);
io.on('connection', (client)=>{
  console.log("CLIENT CONNECTED!");
  client.on("msg", (data)=>{
    console.log("QQQQQQQQQQ");
    io.emit("msg"+data);
  })

  client.on("login", (currentUser) => {
    console.log('Server received event name: login from client');
    console.log('Server now emitting events to current user friends who are online');
    for(let friend of currentUser.friends) {
      io.emit("online"+friend._id, currentUser);
    }
  })

  client.on("logout", (currentUser) => {
    console.log('Server received event name: logout from client');
    console.log('Server now emitting events to current user friends who are online');
    for(let friend of currentUser.friends) {
      console.log("offline"+friend._id);
      io.emit("offline"+friend._id, currentUser);
    }
  })
})

