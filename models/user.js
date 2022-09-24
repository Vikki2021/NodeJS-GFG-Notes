let mongoose = require("mongoose");

const UserSchema = new mongoose.Schema( {
  name: {type : String, required: true},
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String,required: true},
  age: {type : Number, default:0}
});


//Hookes
UserSchema.pre('save', function(next) {
  console.log("pre hook executed before save operation !");
  next(); 
});

const User = mongoose.model("User",UserSchema);
//collection name: smallcase(name)+ s

module.exports = User;



