const parseIt = require('../utils/parseIt')
const multer  = require('multer')
const crypto  = require('crypto')
const mime    = require('mime')
const path = require('path')
const fs = require('fs')
let modelcv = require('../models/modelcv')
const https= require('https');
const  Request = require("request");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, './uploads/Parsing/')
  },
  filename: function (req, file, cb) {
  cb(null, Date.now() + '-' +file.originalname )
  }
})

var upload = multer({ storage: storage }).array('file')
exports.RootPage= ( function(req, res) {
  upload(req, res, function (err) {
  if (err instanceof multer.MulterError) {
  return res.status(500).json(err)
  } else if (err) {
  return res.status(500).json(err)
  }
  fs.readdir('./uploads/Parsing/',  function (err, files){
  //handling error
  if (err) {
  return console.log('Unable to scan directory: ' + err);
  } 
  //listing all files using forEach
  files.forEach(  function  (file) {
  console.log(file); 
  parseIt.parseResume('./uploads/Parsing/'+file, './compiled');
  });
  });
  return res.status(200).send(req.file)

 });
});
  
exports.insert = (req, res, next) => {
  fs.readdir('./compiled', function (err, files) {
  // Handling error
  if (err) {
  return console.log('Unable to scan directory: ' + err);
  }
  // Listing all files using forEach
  files.forEach(function (file) {
  fs.readFile('./compiled/' + file, 'utf8',async function (err, data) {
  if (err) throw err;
  var json = JSON.parse(data);
  let CvObj = new modelcv(json)
  await   CvObj.save(function (err, result) {
  console.log('saved into dataset')
  if (err) {
  console.log('ERROR'),
  res.status(500).send()
  }
  res.status(200).send()
  });
  fs.unlink("./compiled/"+file, (err) => {
  if (err) {
  console.log("failed to delete local file on compiled:"+err);
  }
  });
  });
  });
});
  fs.readdir('./uploads/Parsing/', function (err, files) {
  // Handling error
  if (err) {
  return console.log('Unable to scan directory uploads: ' + err);
  }
  // Listing all files using forEach
  files.forEach(function (file) {
  fs.readFile('./uploads/Parsing/' + file, 'utf8',async function (err, data) {
  if (err) throw err;
  fs.unlink("./uploads/Parsing/"+file, (err) => {
  if (err) {
  console.log("failed to delete local file on uploads:"+err);
  } 
  });
  });
});
});

}
           
exports.parsedresume= ( async function(req, res) {  
  var tab = Array();
  await new Promise (resolve => {
  setTimeout(resolve, 350);
  fs.readdir('./compiled', function (err, files) {
  // Handling error
  if (err) {
  return console.log('Unable to scan directory: ' + err);
  }
  // Listing all files using forEach
  files.forEach(function (file) {
  fs.readFile('./compiled/' + file,'utf8',function (err, data)  {
  if(err) {
  res.json({status: 'error', reason: err.toString()});
  return;
  }
  var json = JSON.parse(data);
  let CvObj = new modelcv(json)
  tab.push(CvObj)
  });

  });

});


});
console.log("returning result")
return res.status(200).send(tab)
});  

    
  
exports.getall= ( async function(req, res) {  
  modelcv.find(function(err, resume) {
  if (err) {
  console.log(err);
  } else {
  res.json(resume);
  }
  });
});


exports.verifnum= ( async function(req, res) {  
  Request.get('http://apilayer.net/api/validate?access_key=6f058e8d12f78fa6b4840c6ab3235c56&number='+req.params.number, (error, response, body) => {
    if(error) {
        return console.log(error);
    }
    console.log(JSON.parse(body))
    res.json(JSON.parse(body));

});
});



exports.deleteitem= ( async function(req, res) {  
  modelcv.findByIdAndRemove(req.params.id, (error, data) => {
  if (error) {
  return next(error);
  } else {
  res.status(200).json({
  msg: data
  })
  }
  });
  });

exports.deleteparsed= ( async function(req, res) {  
   fs.readdir('./compiled', function (err, files) {
// Handling error
   if (err) {
   return console.log('Unable to scan directory: ' + err);
   }
// Listing all files using forEach
   files.forEach(function (file) {
   fs.readFile('./compiled/' + file, 'utf8',async function (err, data) {
   fs.unlink("./compiled/"+file, (err) => {
   if (err) {
   console.log("failed to delete local file on compiled:"+err);
   }
   });
   });
   });
   });
   fs.readdir('./uploads/Parsing/', function (err, files) {
// Handling error
   if (err) {
    return console.log('Unable to scan directory uploads: ' + err);
}
// Listing all files using forEach
  files.forEach(function (file) {
  fs.readFile('./uploads/Parsing/' + file, 'utf8',async function (err, data) {
  if (err) throw err;
  fs.unlink("./uploads/Parsing/"+file, (err) => {
  if (err) {
  console.log("failed to delete local file on uploads:"+err);
  } 
  res.status(200).send()

  });
  });
  });
  });

  });   

  exports.editresume= ( async function(req, res) {  
    modelcv.findById(req.params.id, (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    })

  })

