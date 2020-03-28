import multer from 'multer';
import unzipper from 'unzipper';
import fs from 'fs';
import UploadedFile from '../../models/uploadedfile'
/**
 * files management controller
 */
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
    console.log('uploading file to /uploads '+req.files.filename)
    console.log(req.files);
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
                ownerId : user._id,
                createdAt : Date.now()
              }).save(function (err,file) {
                if(err)  if(err){
                  console.log("l : 43 stackTrace is "+err)
                  res.status(400).send("error recording file ownership... to database")
                 }
                console.log('file ownership saved to database as '+file)
              })
            }
            else {
              entry.autodrain();
            }
          }).on('finish',function(){
            fs.unlink('uploads/'+element.filename,function(err){
              if(err){
                console.log("l 55 stacktrace is : "+err)
                res.status(400).send("error saving archive file, rar file corrupted or not found...")
               }
              console.log('archive unzipped & deleted successfully');
          });  
          });  
      }else{
        console.log('simple files spotted, saving... '+req.files.filename)
        var saveToDb = new UploadedFile({
          filename : element.filename,
          ownerUsername : user.username,
          ownerId : user._id,
          createdAt : Date.now()
        }).save(function (err,file) {
          if(err){
             console.log(err)
             res.status(400).send("error saving single file")
            }
          console.log('single file ownership saved to database as '+file)
        })
      }
    });
    res.status(200).send(req.file)
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

exports.deleteFiles = (req,res) =>{
  console.log(req.body)
  req.body.files.forEach(element => {
    console.log('deleting file inside '+element.filename)
    UploadedFile.deleteOne({
      _id : element._id
    },(error,docs)=>{
      if (error) console.log(error)
      else {
        fs.unlink('uploads/'+element.filename,function(err){
          if(err) console.log(error)
          else console.log("deleted")
      });
    }
    })
  });
  res.status(200).send('deleted files')
}