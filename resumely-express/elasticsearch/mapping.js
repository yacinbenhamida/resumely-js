const client = require("./connection");

client.indices.create({
    index: _index,
    body: {
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
                        "type": "ngram",
                        "min_gram": 2,
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
            "employee": {
                "properties": {
              
                    "country": {
                        "type": "text",
                        "analyzer": "autocomplete",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            },
                            "edge_ngrams": {
                                "type": "text",
                                "analyzer": "edge_ngram"
                            }
                        }
                    },
                    " firstName": {
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
                            }
                        }
                    },
                    "profile": {
                        "type": "keyword"
                    },
                    "currentPosition": {
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
                            }
                        }
                    },
                    "livesIn": {
                        "type": "text",
                        
                    }
                }
            }
        }
    }

})
  .then(resp => console.log("Mappings successfully created", resp))
  .catch(err => console.log("There was an error creating your mappings", err));
