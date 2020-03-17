let mongoose = require('mongoose')

const modelcvSchema = new mongoose.Schema({
    name:{
        firstName: {
            type: String
          },
          lastName: {
            type: String
          },
          fullName: {
            type: String
          }
    },
    email: {
        type: String
      },
      adresse: {
        type: String
      },
      phone:{
          type: String
      },
      phone:{
        type: String
    },
    DateNaissance:{
        type: String
    },
    age:{
      type: String
  } 

}, {collection : 'datatset'}) 



module.exports = mongoose.model('datatset', modelcvSchema)