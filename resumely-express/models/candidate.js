import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic'
import esClient from '../elasticsearch/connection'

const CandidateSchema = new mongoose.Schema({
    firstName:  {   type: String },
    lastName:   {     type: String    },
    country:    {   type: String    },
    currentPosition:    {   type: String  , es_indexed: false  },
    profile:    {   type: String  , es_indexed: false  } ,
    livesIn:    {   type:String     },
    image_url:  {   type : String  , es_indexed: false },
    /*experiences : [{
        job_details : String,
        job : String,
        job_date : String
    }],*/
    presentation : {    type : String  , es_indexed: false },
   /* education : [{
            university : String,
            date : String,
            diploma : String
        }],*/
    skills : {type: [String] ,es_indexed: false}
}, {collection : 'profiles'}) 


CandidateSchema.plugin(mongoosastic, {
    "host": "localhost",
    "port": 9200,
   
});

var Candidate=mongoose.model('profile', CandidateSchema,'profiles')

Candidate.createMapping({
    
    "settings": {
        "analysis": {
          "analyzer": {
            "autocomplete": {
              "tokenizer": "autocomplete",
              "filter": [
                "lowercase"
              ]
            },
            "autocomplete_search": {
              "tokenizer": "lowercase"
            },
           
          },
          "tokenizer": {
            "autocomplete": {
              "type": "edge_ngram",
              "min_gram": 1,
              "max_gram": 10,
              "token_chars": [
                "letter"
              ]
            }
          }
        }
      },
      "mappings": {
        "profile": {
          
          "properties": {
            "firstName": {
              "type": "keyword",
             
            "fields": {
                              
              "autocomplete": {
                  "type": "text",
                  "analyzer": "autocomplete",
                  "search_analyzer": "autocomplete_search"
              }
             }
             
           
              
            },
            "lastName": {
              "type": "keyword",
            
            "fields": {
                              
              "autocomplete": {
                  "type": "text",
                  "analyzer": "autocomplete",
                  "search_analyzer": "autocomplete_search"
              }
             }
      
      
            },
            "country":{
               "type": "keyword" ,
               
               "fields":
               {
                 "raw":
                 {
                  "type": "text",
                  "analyzer":"standard",
                 }
               }
            }
          }
        }
      }

    }, (err, mapping) => {
    if (err) {
    console.log('error creating mapping (you can safely ignore this)');
    console.log(err);
    } else {
    console.log('mapping created!');
    console.log(mapping);
    }
    });



module.exports =  Candidate;