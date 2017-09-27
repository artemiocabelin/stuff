var mongoose = require('mongoose');
var bcrypt = require('bcrypt'); 
let Room = mongoose.model('MusicRoom')
let User = mongoose.model('User');
module.exports = {
  create: function(req, res){
    Room.find({}).sort('-createdAt').exec(function(err, rooms){
      var id = 0;
      if(rooms.length == 0)
        id = 1;
      else{
        id = rooms[0].roomId + 1;
      }
      req.body._owner = req.session.currentUser;
      console.log("PUBLIC?");
      console.log(req.body.isPublic);
      if(req.body.isPublic == "false"){
        req.body.isPublic = false;
      }
      else{
        req.body.isPublic = true;
        req.body.password = null;
      }
      req.body.chatlog = [];
      req.body.playlist = [];
      req.body._roomMembers = [];
      req.body.roomId = id;
      newRoom = new Room(req.body);
      newRoom.save(function(err){
        console.log("SAVE ERR");
        console.log(err);

        User.findOneAndUpdate({userId: req.session.currentUser.userId}, {$push: {joinedRooms: newRoom}}, {$push: {ownedRooms: newRoom}}, function(err2){
          if(err2)
            res.json(err2)
          else
            res.json(true);
        })
      })
    })
  },

  allRooms: function(req, res){
    Room.find({}).populate('_owner').exec(function(err, rooms){
      res.json(rooms);
    });
  },

  getRoomById: function(req, res){
    Room.findOne({roomId: req.params.id}, function(err, room){
      res.json(room);
    })
  },

  newMessage: function(req, res){
    console.log("AHFAHSDBFLAFKDNA");
    console.log(req.body.message);
    Room.findOne({roomId: req.params.id}, function(err, room){
      console.log("HERE");
      room.chatlog.push({user: req.session.currentUser.username, message: req.body.message, id: req.session.currentUser.userId})
      room.save(function(err){
        if(err)
          res.json(false);
        else
          res.json(true);
      })
    })
  },

  joinRoom: function(req, res){
    Room.findOne({roomId: req.params.id}, function(err, room){
      room._roomMembers.push(req.session.currentUser);
      room.save(function(err){
        User.findOneAndUpdate({userId: req.session.currentUser.userId}, {$push:{joinedRooms: room}}, {new: true}, function(err2, updatedUser){
          if(err2) {
            res.json(err2);
          }
          else {
            req.session.currentUser = updatedUser;
            res.json(true);
          }
        } )
      })
    })
  }

}
