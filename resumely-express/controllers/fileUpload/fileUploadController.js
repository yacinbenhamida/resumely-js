import multer from 'multer';
import unzipper from 'unzipper';
import fs from 'fs';
import UploadedFile from '../../models/uploadedfile.model'
import mongoose from 'mongoose'
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})
var upload = multer({ storage: storage }).array('file')
exports.uploadFiles = (req,res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
    console.log('uploading file to /uploads '+req.files.originalname)
    var user = JSON.parse(req.body.user)
    req.files.forEach(element => {
      if(element.mimetype === "application/x-zip-compressed"){
        console.log('archive spotted, extracting... '+req.files.originalname)
          fs.createReadStream('uploads/'+element.filename)
          .pipe(unzipper.Parse())
          .on('entry', function (entry) {
            var fileName = entry.path;
            const type = entry.type; // 'Directory' or 'File'
            const size = entry.vars.uncompressedSize; 
            console.log('name '+fileName+" type " + type +" size "+size )
            if(type === "File"){
              fileName = Date.now() + '-' + fileName      
              entry.pipe(fs.createWriteStream('uploads/'+fileName ))
              var saveToDb = new UploadedFile({
                filename : fileName,
                ownerUsername : user.username,
                ownerId : user._id
              }).save(function (err,file) {
                if(err) console.log(err)
                console.log('file ownership saved to database as '+file)
              })
            }
            else {
              entry.autodrain();
            }
          }).on('finish',function(){
            fs.unlink('uploads/'+element.filename,function(err){
              if(err) return console.log(err);
              console.log('archive unzipped & deleted successfully');
          });  
          });  
      }
    });
    return res.status(200).send(req.file)
 })
}

exports.getAllUserFiles = (req,res) => {
    UploadedFile.find({
      ownerId: req.params.id
    },function (err,docs) {
      if(err) res.status(400).send(err)
      res.status(200).send(docs)
    })
}

exports.deleteFile = (req,res) =>{

}