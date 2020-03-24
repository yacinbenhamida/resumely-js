const express = require("express");
const client = require("./../elasticsearch/connection");



exports.getAllData = async(req ,res)=>{
   
    try {
     
      const response = await client.search({
        index: "profiles",
        body: {
          size : 10,
          from : req.params.from,
          query: {
            match_all: {}
          }

        }
      });
      var results =response.hits.hits.map(function (hit) {
        return hit;
      
    });
     
    res.status(200).json(results);
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
    var results =response.hits.hits.map(function (hit) {
      return hit;
    
  });
   
  res.status(200).json(results);
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
      return hit;
    
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
          "profile-suggest" : {
              "prefix" : req.params.prefix,
              "completion" : {
                  "field" : "firstName.completion"
              }
          }
      }
      }
    });
    res.status(200).json(response['suggest']['profile-suggest'][0]['options']);

  } catch (error) {
    res.status(500).json(error);
  }
}