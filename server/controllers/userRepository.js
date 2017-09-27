let mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let User = mongoose.model('User');

module.exports = {
    registerAUser: (req, res) => {
        // console.log('server registering user');
        let newUserId = 1;
        User.find({}).sort('-createdAt').exec((error, users) => {
            if (error) {
                console.log('something went wrong');
            } else {
                if(users && users.length > 0) {
                    // console.log('users true, got all users, now updating newUser id');
                    newUserId = users[0].userId + 1;
                }
                req.body.userId = newUserId;
            }

            let newUser = new User(req.body);
            // console.log(newUser);
            newUser.save((error, savedUser) => {
                if (error) {
                    console.log('error registering user');
                    res.json(error);
                } else {
                    // console.log('success registering user');
                    res.json(savedUser);
                }
            });

        });
    },
    loginUser: (req, res) => {
        // console.log('server logging in user');
        User.findOne({username:req.body.username}, function(err, foundUser){
            if(err) {
                console.log('error loggin user in');
                console.log(err);
            }
            else {
                if(foundUser == null){
                res.json(false);
                }
                else if(bcrypt.compareSync(req.body.password, foundUser.password)){
                    // console.log('login success, adding user to session')
                    User.findOneAndUpdate({_id: foundUser._id}, {isLoggedIn: true}, {new: true}, (err, updatedUser) => {
                        User.update({friends: updatedUser._id}, {$push: {onlineFriends: updatedUser._id}}, (err, friendUser)=> console.log(friendUser));
                        req.session.currentUser = updatedUser;
                        console.log(updatedUser);
                        res.json(updatedUser);
                    });
                }
                else{
                // console.log('LOGIN FAILED!');
                    res.json(false);
                }
            }
        })
    },
    getCurrentUser: (req, res) => {
        // console.log('server getting current user');
        if(req.session.currentUser) {
            User.findOne({_id: req.session.currentUser._id})
                .populate('friends favoriteSongs joinedRooms ownedRooms received_invites sent_invites onlineFriends')
                .exec((error, foundUser) => {
                    if (foundUser) {
                        // console.log('found current User');
                        res.json(foundUser);
                    } else {
                        // console.log('not found current User');
                        res.json(false);
                    }
                });
        } else {
            // console.log('server did not find a user in session');
            res.json(false);
        }
    },
    logoutUser: (req, res) => {
        // console.log('server logging out user');
        User.findOneAndUpdate({_id:req.session.currentUser._id}, {isLoggedIn: false}, {new: true}, (err, updatedUser) => {
            res.json(updatedUser)
        })
        delete req.session.currentUser;
    },
    getUserByUserId: (req, res) => {
        // console.log('server getting user by id');
        User.findOne({userId: req.params.id})
            .populate('friends favoriteSongs joinedRooms ownedRooms received_invites sent_invites')
            .exec((error, foundUser) => {
                if(error){
                    console.log('server error getting user');
                    console.log(error);
                } else {
                    // console.log('server success getting user');
                    res.json(foundUser);
                }
            });
    },
    getAllUsers: (req, res) => {
        // console.log('server getting all users');
        User.find({})
            .populate('friends favoriteSongs joinedRooms ownedRooms')
            .exec((error, foundUsers) => {
                if(error){
                    console.log('server error getting user');
                    console.log(error);
                } else {
                    // console.log('server success getting user');
                    res.json(foundUsers);
                }
            });
    },
    sendInviteToUserById: (req, res) => {
        // console.log('server current user sending invite to user');
        User.findOneAndUpdate({userId: req.body.userId}, {$push: {received_invites: req.session.currentUser._id}}, {new: true}, 
                    (error, updatedUser) => {
                        if(error) {
                            console.log('server error sending invite');
                            res.json(error);
                        } else {
                            // console.log('server success sending invite');
                            if (updatedUser) {
                                // console.log('before pushing to sent_invites')
                                // console.log(updatedUser);
                                User.findOneAndUpdate({_id: req.session.currentUser._id}, {$push: {sent_invites: updatedUser._id}}, {new: true}, 
                                            (error, updatedCurrentUser) => {
                                                if (error) {
                                                    console.log('server error updating current user sent invite');
                                                    res.json(error);
                                                } else {
                                                    // console.log('server success updating current user sent invite');
                                                    // console.log(updatedCurrentUser);
                                                    res.json(updatedCurrentUser);
                                                }
                                            });
                            }
                        }
                    });
    },

    addFriendAndUpdateReceivedInvite: (req, res) => {
        // console.log('server adding friend and updating received invite list');
        User.findOneAndUpdate({_id: req.session.currentUser._id}, 
                              {$push: {friends: req.body.inviteId},
                               $pull: {received_invites: req.body.inviteId}}, 
                              {new: true}, 
                              (error, updatedUser) => {
                                    if(error) {
                                        console.log('server error adding friend to user');
                                        console.log(error);
                                        res.json(error);
                                    } else {
                                        // console.log('server success adding friend to user');
                                        // console.log(updatedUser);
                                        User.findOneAndUpdate({_id: req.body.inviteId},
                                                             {$push: { friends: updatedUser._id},
                                                              $pull: { sent_invites: updatedUser._id}},
                                                              {new: true},
                                                              (error, tUpdateduser) => {
                                                                  if (error) {
                                                                    console.log('error adding current user to target user friend list');
                                                                    console.log(error);
                                                                  } else {
                                                                    // console.log('success adding current user to target user friend list');
                                                                    res.json(tUpdateduser);
                                                                  }
                                                              });
                                    }
                                });
    },

    deleteInviteAndUpdateUsers: (req, res) => {
        // console.log('server deleting invite on curr and target users');
        User.findOneAndUpdate({_id: req.session.currentUser._id}, {$pull: {received_invites: req.body.inviteId}}, {new: true}, 
                                (error, updatedUser) => {
                                    if(error) {
                                        console.log('error deleting invite on curr Users received invite list')
                                        console.log(error);
                                    } else {
                                        // console.log('success deleting invite on curr Users received invite list')
                                        // console.log(updatedUser);
                                        User.findOneAndUpdate({_id: req.body.inviteId}, {$pull: {sent_invites: updatedUser._id}}, {new: true}, 
                                                                (error, tUpdatedUser) => {
                                                                    if(error) {
                                                                        console.log('error deleting invite on target user sent invite list')
                                                                        console.log(error);    
                                                                    } else {
                                                                        // console.log('success deleting invite on curr Users received invite list')
                                                                        // console.log(tUpdatedUser);
                                                                        res.json(tUpdatedUser);
                                                                    }
                                                                })
                                    }
                                })
    },

    removeFriendFromCurrentUser : (req, res) => {
        // console.log('server removing friend from current user');
        User.findOneAndUpdate({_id: req.session.currentUser._id}, {$pull: {friends: req.body.friendId}}, {new: true}, 
                                (error, updatedUser) => {
                                    if (error) {
                                        console.log('error removing friend from current user');
                                        console.log(error);
                                    } else {
                                        // console.log('success removing friend from current user');
                                        // console.log(updatedUser);
                                        User.findOneAndUpdate({_id: req.body.friendId}, {$pull: {friends: updatedUser._id}}, {new: true},
                                                                (error, tUpdateduser) => {
                                                                    if(error) {
                                                                        console.log('error removing current user from friendlist of removed friend');
                                                                        console.log(error);
                                                                    } else {
                                                                        // console.log('error removing current user from friendlist of removed friend');
                                                                        // console.log(tUpdateduser);
                                                                        res.json(tUpdateduser); 
                                                                    }
                                                                });
                                    }
                                });
    },

    editCurrentUser: (req, res) => {
        User.findOneAndUpdate({_id: req.session.currentUser._id}, 
                              { email: req.body.email,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                description: req.body.description }, 
                              { new: true},
                              (error, updatedUser) => {
                                  if (error) {
                                      console.log('error updating current user');
                                      console.log(error);
                                  } else {
                                    //   console.log('success updating current user');
                                    //   console.log(updatedUser);
                                      req.session.currentUser = updatedUser;
                                      res.json(req.session.currentUser);
                                  }
                              });
    },

    saveLastFmSessionTokenAndSigToUserInSession: (req, res) => {
        User.findOneAndUpdate({_id: req.session.currentUser._id},
                              { lastfmSessionToken: req.body.lastFmSession, lastfmSessionSig: req.body.lastFmSessionSig},
                              { new: true},
                              (error, updatedUser) => {
                                  if (error) {
                                      console.log('error saving session token');
                                      console.log(error);
                                      res.json(false);
                                  } else {

                                      req.session.currentUser = updatedUser;
                                      res.json(updatedUser);
                                  }
                              });
    },

    saveToOnlineFriends: (req, res) => {
        User.findOneAndUpdate({_id: req.session.currentUser._id}, {$push: {onlineFriends: req.body._id}}, (err, updatedUser) => {
            req.session.currentUser = updatedUser;
            res.json(updatedUser);
        });
    },

    removeFromOnlineFriends: (req, res) => {
        console.log(req.body._id);
        console.log(req.body.username);
        User.findOneAndUpdate({_id: req.session.currentUser._id}, {$pull: {onlineFriends: req.body._id}}, (err, updatedUser) => {
            req.session.currentUser = updatedUser;
            console.log('finished updating ' + updatedUser.username);
            res.json(updatedUser);
        });
    },
}