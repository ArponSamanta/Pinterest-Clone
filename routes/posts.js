const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL).then(console.log("connected to mongodb"));


const postSchema = new mongoose.Schema({
  caption: { type: String, required: true },
  image:{
    type:String
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt:{
    type:Date,
    default:Date.now,
  },
  likes:{
    type: Array,
    default:[],
  }
});

module.exports = mongoose.model('Post', postSchema);


