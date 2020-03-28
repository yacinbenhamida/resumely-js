import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic'
import esClient from '../elasticsearch/connection'

const CandidateSchema = new mongoose.Schema({
    firstName:  {   type: String },
    lastName:   {     type: String    },
    country:    {   type: String    },
    currentPosition:    {   type: String    },
    profile:    {   type: String    } ,
    livesIn:    {   type:String     },
    image_url:  {   type : String   },
    experiences : [{
        job_details : String,
        job : String,
        job_date : String
    }],
    presentation : {    type : String   },
    education : [{
            university : String,
            date : String,
            diploma : String
        }],
    skills : [String]
}, {collection : 'profiles'}) 


CandidateSchema.plugin(mongoosastic, {
    "host": "localhost",
    "port": 9200,
   
});

var Candidate=mongoose.model('profile', CandidateSchema,'profiles')

Candidate.createMapping({
    "settings": {
        "analysis": {
            "tokenizer": {
                "edge_ngram_tokenizer": {
                    "type": "edge_ngram",
                    "min_gram": 2,
                    "max_gram": 10
                }
            },
            "filter": {
                "autocomplete_filter": {
                    "type": "edge_ngram",
                    "min_gram": 1,
                    "max_gram": 50
                },
                "trigram_filter": {
                    "type": "ngram",
                    "min_gram": 3,
                    "max_gram": 3
                },
                "stemmer_filter": {
                    "type": "stemmer",
                    "name": "english"
                },
                "stopword_filter": {
                    "type": "stop",
                    "stopwords": "_english_"
                },
                "edge_ngram_filter": {
                    "type": "edge_ngram",
                    "min_gram": 2,
                    "max_gram": 10
                },
                "custom_stop": {
                    "type": "stop",
                    "stopwords": "_english_"
                },
                "custom_shingle": {
                    "type": "shingle",
                    "min_shingle_size": "2",
                    "max_shingle_size": "3"
                }
            },
            "char_filter": {
                "emoticons": {
                    "type": "mapping",
                    "mappings": [
                        ":) => _happy_",
                        ":( => _sad_"
                    ]
                }
            },
            "analyzer": {
                "autocomplete": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": [
                        "asciifolding",
                        "trim",
                        "lowercase",
                        "autocomplete_filter"
                    ]
                },
                "trigram": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": [
                        "asciifolding",
                        "trim",
                        "lowercase",
                        "trigram_filter"
                    ]
                },
                "stemmer": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": [
                        "asciifolding",
                        "trim",
                        "lowercase",
                        "stemmer_filter"
                    ]
                },
                "lower_keyword": {
                    "type": "custom",
                    "tokenizer": "keyword",
                    "filter": [
                        "asciifolding",
                        "trim",
                        "lowercase"
                    ]
                },
                "keywords": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "char_filter": [
                        "html_strip",
                        "emoticons"
                    ],
                    "filter": [
                        "asciifolding",
                        "trim",
                        "lowercase",
                        "stopword_filter",
                        "stemmer_filter"
                    ]
                },
                "reverse": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": ["lowercase", "reverse"]
                },
                "edge_ngram": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": [
                        "asciifolding",
                        "trim",
                        "lowercase",
                        "edge_ngram_filter"
                    ]
                },
                "tokenizer": {
                    "tokenizer": "standard",
                    "filter": [
                        "standard",
                        "lowercase",
                        "custom_stop",
                        "custom_shingle"
                    ]
                }
            }
        }
    },
    "mappings": {
        "profile": {
            "properties": {
             
               
                "firstName": {
                    "type": "text",
                    "fields": {
                        "autocomplete": {
                            "type": "text",
                            "analyzer": "autocomplete"
                        },
                        "stemmer": {
                            "type": "text",
                            "analyzer": "stemmer"
                        },
                        "reverse": {
                            "type": "text",
                            "analyzer": "reverse"
                        },
                        "raw": {
                            "type": "keyword"
                        },
                        "edge_ngrams": {
                            "type": "text",
                            "analyzer": "edge_ngram"
                        },
                        "token": {
                            "type": "text",
                            "analyzer": "tokenizer"
                        },
                        "completion": {
                          "type": "completion"
                        }
                    }
                },
                "lastName": {
                    "type": "text",
                    "fields": {
                        "autocomplete": {
                            "type": "text",
                            "analyzer": "autocomplete"
                        },
                        "stemmer": {
                            "type": "text",
                            "analyzer": "stemmer"
                        },
                        "reverse": {
                            "type": "text",
                            "analyzer": "reverse"
                        },
                        "raw": {
                            "type": "keyword"
                        },
                        "edge_ngrams": {
                            "type": "text",
                            "analyzer": "edge_ngram"
                        },
                        "token": {
                            "type": "text",
                            "analyzer": "tokenizer"
                        },
                        "completion": {
                          "type": "completion"
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