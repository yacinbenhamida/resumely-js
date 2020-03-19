const express = require("express");
const client = require("./../elasticsearch/connection");



exports.getAllData = async(req ,res)=>{
   
    try {
     
      const response = await client.search({
        index: "profiles",
        body: {
         
          query: {
            match_all: {}
          }
        }
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json(error);
    }
 }
 
 exports.autocompleteMultiMatchEdgeNGramsFn= async(req ,res)=>{
   
  console.log(req.params.prefix)
  try {
   
    const response = await client.search({
      index: "profiles",
      body: {
       
        "query": {
          "multi_match": {
              "query": req.params.prefix,
              "type": "most_fields",
              "fields": ["firstName.edge_ngrams^2", "lastName.edge_ngrams"   ]
          }
      }
      }
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.autocompleteMultiMatchNGramsFn = async(req ,res)=>{
   
  console.log(req.params.prefix)
  try {
   
    const response = await client.search({
      index: "profiles",
      body: {
      
        "query": {
          "multi_match": {
              "query": req.params.prefix,
              "type": "most_fields",
              "fields": ["firstName.autocomplete^10", "lastName.autocomplete^5"]
          }
      }
      }
    });

   
    var results =response.hits.hits.map(function (hit) {
      return hit._source.firstName + " " + hit._source.lastName;
    
  });
   
  res.status(200).json(results);
  } catch (error) {
    res.status(500).json(error);
  }
};




 exports.autoComplete = async(req ,res)=>{
   
  console.log(req.params.prefix)
  try {
   
    const response = await client.search({
      index: "profiles",
      body: {
       
        "suggest": {
          "movie-suggest" : {
              "prefix" : req.params.prefix,
              "completion" : {
                  "field" : "firstName.completion"
              }
          }
      }
      }
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
}