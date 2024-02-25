var express = require('express');
var router = express.Router();
const usermodel=require('./users');
const postmodel=require('./posts');
const passport = require('passport');
const localStrategy=require('passport-local');
// const upload = require("./multer");


const multer  = require('multer');
const { storage } = require("../cloudeConfig.js");
const upload = multer({ storage });


const profilePicUpload=require("./multerDP");
passport.use(new localStrategy (usermodel.authenticate()));

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/login', function(req, res) {
  res.render('login',{error:req.flash('error')});
});

router.get('/feed',isLoggedIn, async function(req, res) {
  const user= await usermodel.findOne({username:req.session.passport.user})
  const allPosts=await postmodel.find()
  .populate("user")
  res.render('feed',{user,allPosts});
});

router.post('/upload',isLoggedIn, upload.single("file"), async function(req, res, next) {
  if(!req.file){
    return res.status(400).send("No files were uploaded");
  }
  const user=await usermodel.findOne({username:req.session.passport.user})
  const post= await postmodel.create({
    caption:req.body.imageCaption,
    image:req.file.filename,
    user:user._id
  });

  user.posts.push(post._id)
  await user.save()
  res.redirect('/profile');
});

router.post('/dpupload',isLoggedIn,profilePicUpload.single("dp"),async function(req,res,next){
  const user=await usermodel.findOne({username:req.session.passport.user});
  user.profileImage=req.file.filename;
  await user.save();
  res.redirect('/profile');
})

router.get('/profile',isLoggedIn, async function(req, res) {
  const user=await usermodel.findOne({
    username:req.session.passport.user,
  })
  .populate("posts")
  res.render('profile',{user});
});

router.get('/edit',isLoggedIn, function(req, res) {
  res.render('edit');
});

router.post('/details',isLoggedIn, async function(req, res) {
  const user=await usermodel.findOne({username:req.session.passport.user})
  user.tagline=req.body.tagLine;
  user.description=req.body.desCription;
  await user.save();
  res.redirect('/profile');
});

router.post('/register',function(req,res){
  const { username, email } = req.body;
  const userdata = new usermodel({ username, email });
  usermodel.register(userdata,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res, function(){
      res.redirect('/profile');
    })
  })
});

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true
}),function(req,res){})

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login')
}

module.exports = router;
