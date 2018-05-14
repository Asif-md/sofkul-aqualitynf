const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const database = require('../db.config');



// User Schema
const UserSchema = mongoose.Schema ({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
  const query = {username: username}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}




/*var nextId = Counter.findByIdAndUpdate(
  {_id: 'userid'},
  { $inc: { incr: 1 } },
  function (err, data) {
      if(err){
          console.log(err.stack || err.message)
      } else{
          console.log("successful")
      }
      console.log(data.sequence_value);

      var item = new Item();
      item.itemId = data.sequence_value;

       // Save the item that has been sent.
      item.save();  // arguably, your response would come in the .save() callback, if you care about whether that was successful or not. 

     // If adding the user is successful. Send back the user.
      res.json(req.body);
  });
*/