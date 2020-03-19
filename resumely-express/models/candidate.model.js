import mongoose from 'mongoose';

const mongoosastic =require('mongoosastic')
const esClient = require('./../elasticsearch/connection');

const CandidateSchema = new mongoose.Schema({

    firstName:
     {
           type: String, es_indexed: true
    },
    lastName: 
    {
            type: String,  es_indexed: true
    },
    country: 
    {
            type: String
    }
    ,
    currentPosition:
    {
        type: String
    },
      
    profile:
    {
        type: String
    } ,

    livesIn:{
      type:String
    }

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
    "my_analyzer": {
    "type": "custom",
    "tokenizer": "classic",
    "char_filter": [ "my_pattern" 	],
    "filter": ["lowercase"]
    }
    },
    "char_filter": {
    "my_pattern": {
    "type": "pattern_replace",
    "pattern": "\\.",
    "replacement": " "
    }
    }
    }
    },
    "mappings": {
    "profile": {
    "dynamic_templates": [{
    "strings": {
    "match_mapping_type": "string",
    "mapping": {
    "type": "text",
    "fields": {
    "keyword": {
    "type": "keyword"
    }
    }
    }
    }
    }],
    "properties": {
    "firstName": {
    "type": "text",
    "analyzer": "my_analyzer"
    },
    "lastName": {
    "type": "keyword"
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