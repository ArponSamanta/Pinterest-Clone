var express = require('express');
var router = express.Router();
const plm=require('passport-local-mongoose');

const mongoose=require('mongoose');
mongoose.connect(process.env.MONGO_URL).then(console.log("connected to mongodb"));


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String},
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post'
  }],
  profileImage:{type:String},
  tagline:{type:String},
  description:{type:String},
});

userSchema.plugin(plm);

module.exports  = mongoose.model('User', userSchema);





