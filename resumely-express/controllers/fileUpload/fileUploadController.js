import multer from 'multer';
import unzipper from 'unzipper';
import fs from 'fs';
import UploadedFile from '../../models/uploadedfile'
import csv from 'csv-parser'
import Candidate from '../../models/candidate'
import User from '../../models/user'
import parseIt from '../../utils/parseIt'
import modelcv from '../../models/modelcv'

/**
 * files management controller
 */
function checkFolder(dir) {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    return "created"
  }
  return "found"
}
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'uploads/files/')
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
    console.log('uploading file to /uploads/files '+req.files.filename)
    var user = JSON.parse(req.body.user)
    req.files.forEach(element => {
      if(element.mimetype === "application/x-zip-compressed"){
        console.log('archive spotted, extracting... '+req.files.originalname)
          fs.createReadStream('uploads/files/'+element.filename)
          .pipe(unzipper.Parse())
          .on('entry', function (entry) {
            var fileName = entry.path;
            const type = entry.type; // 'Directory' or 'File'
            const size = entry.vars.uncompressedSize; 
            console.log('name '+fileName+" type " + type +" size "+size )
            if(type === "File"){
              fileName = Date.now() + '-' + fileName      
              entry.pipe(fs.createWriteStream('uploads/files/'+fileName ))
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
            fs.unlink('uploads/files/'+element.filename,function(err){
              if(err){
                console.log("l 55 stacktrace is : "+err)
                res.status(400).send("error saving archive file, rar file corrupted or not found...")
               }
              console.log('archive unzipped & deleted successfully');
          });  
          });  
      }else if (element.mimetype === "text/csv" || element.mimetype === "application/csv" || 
        element.mimetype === "application/vnd.ms-excel"){
        fs.createReadStream('uploads/files/'+element.filename)
        .pipe(csv({
          mapHeaders: ({ header, index }) => 
            header.trim().toLowerCase()
        }))
        .on('headers', (headers) => {
          console.log(`First header: ${headers[0]}`)
        })
        .on('data', (row) => {
          let data = JSON.parse(JSON.stringify(row))
          console.log(row);
          let saveCandidate = new Candidate({
            firstName : row.firstname|| row.first || row.surname  || row.first_name  ||row.nom ||null,
            lastName : row.lastname || row.last || row.name ||row.lastName || row.last_name  || row.prenom || null,
            age : row.age  || null,
            country : row.country || row.pays ,
            currentPosition :  row.currentposition || row.current || row.current_position || row.poste  || row.job || row.metier || row.titre|| row.current_title|| null,
            livesIn : row.adresse || row.addr || row.address  || null,
            imageUrl : row.image || row.image_url || null
          }).save((err,docs)=>{
            if(err){
              console.log(err)
              res.status(400).send("error saving single file")
             }
           console.log('csv file content saved to database as '+docs)
          })
        })
        .on('end', () => {
          fs.unlink('uploads/files/'+element.filename,function(err){
            if(err) console.log(error)
            else console.log("csv deleted")
        });
          console.log('CSV file successfully processed');
        });
      }
      else{
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
    User.findOne({
      $or : [{ username : req.user.email},{email : req.user.email}]
    },{_id : 1 },(e,user)=>{
      console.log(user)
      UploadedFile.find({
        ownerId: String(user._id)
      },function (err,docs) {
        if(err) res.status(400).send(err)
        res.status(200).send(docs)
      })
    })
    
}

exports.deleteFiles = (req,res) =>{
  req.body.files.forEach(element => {
    console.log('deleting file inside '+element.filename)
    UploadedFile.deleteOne({
      _id : element._id
    },(error,docs)=>{
      if (error) console.log(error)
      else {
        fs.unlink('uploads/files/'+element.filename,function(err){
          if(err) console.log(error)
          else console.log("deleted")
      });
    }
    })
  });
  res.status(200).send('deleted files')
}



// parse already saved files 
exports.parseFile = (req,res) => {
  fs.readdir('./uploads/files', function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    fs.readFile('./uploads/files/' + req.body.filename, 'utf8', function (err2, file) {
      if(err2){
        return res.status(400)
      }
        try{
            parseIt.parseResume('./uploads/files/' + req.body.filename, './compiled');     
            return res.status(200)
        }
        catch(error){
          return res.status(400)
        }
    });
  });
}

exports.getParsedData = (req, res) => {
  fs.readdir('./compiled', function (err, files) {
    if (err) {
      return res.status(400)
    }
    fs.readFile('./compiled/' + req.body.filename + '.json', 'utf8', function (error, data) {
      if (error) {
        return res.status(404)
      }
      let target = new modelcv(JSON.parse(data));
      console.log(target)
      fs.unlink('./compiled/'+req.body.filename + '.json',function(pb){
        if(pb){
          res.status(400).send("error deleting file")
         }
        console.log('file deleted successfully');
      });  
      return res.send({ parsed: target });
    });
  });
}

exports.updateFileStatus = (req,res) => {
  UploadedFile.updateOne({_id : req.param.id},{$set : {scanned : true}},(err,docs)=>{
    res.send(docs)
  })
}