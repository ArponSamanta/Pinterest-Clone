const multerDP=require("multer");
const{v4:uuidv4}=require("uuid");
const path= require("path");

const storage = multerDP.diskStorage({
    destination: function (req, file, cb) {
      cb(null, process.env.UPLOAD_DESTINATION || 'public/images/profilepics/')
    },
    filename: function (req, file, cb) {
      const uniquename=uuidv4();
      cb(null, uniquename+path.extname(file.originalname));
    }
  })
  
  module.exports= multerDP({ storage: storage });
  