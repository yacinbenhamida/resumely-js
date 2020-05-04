import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const CnxSchema = new Schema({
    username: {
        type: String,
        required: true,
   
    },
    dateCnx: {
        type: Date,
        required: true,
     
    },
   Os: {
        type: String,
        required: true
    },
   Browser: {
        type: String,
        required: true,
        minlength: 3
    },
    Localisation: {
        type: String,
      //  required: true,
   
    },
 
});





const CnxModel = mongoose.model('HistoriqueCnx',CnxSchema);

module.exports = CnxModel;