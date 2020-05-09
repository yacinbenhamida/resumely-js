const express = require("express");
const client = require("./../elasticsearch/connection");
import Candidate from './../models/candidate'

exports.bulkApi=async(req,res)=>{
  const data = req.body;
  console.log(data)
  let bulkBody = [];
  let item  ;

  bulkBody.push({
    index: { _index: 'profiles', _type: 'profile' } 
  });  
 
  const getCandidate = await Candidate.findById(data.id, function(error, doc) {
 
   item =
   {
    "firstName": doc.firstName,
    "lastName":doc.lastName,
    "country": doc.country,
    "livesIn": doc.livesIn
    }

  });
  console.log(item)
  bulkBody.push(item);

  /*data.forEach(item => {
    bulkBody.push({
      index: { _index: 'profiles', _type: 'profile' } 
    });      
    bulkBody.push(item);

  });
 */

client.bulk(
  {body: bulkBody},
  function(err, response) {
    if (err) { console.log(err); return; }
    console.log(`Inside bulk3...`);
    let errorCount = 0;
   /* response.items.forEach(item => {
      if (item.index && item.index.error) {
        console.log(++errorCount, item.index.error);
      }
    });
    console.log(`Successfully indexed ${data.length - errorCount} out of ${data.length} items`);*/
    console.log('`Successfully indexed')
  })
  res.send(200)
}


exports.getAllData = async(req ,res)=>{
   
    try {
     
      const response = await client.search({
        index: "profiles",
        body: {
          size : 10,
          from : req.params.from,
          "sort" : [
        
            { "firstName.raw" : "asc" }
        ],
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

 exports.getCountries = async(req ,res)=>{
   
  try {
   
    const response = await client.search({
      index: "profiles",
      body: {
        size : 100,
  
       
        "aggs": {
          "all_indexes": {
             "terms": {
                "field": "country.filter",
                "size": 300,
                "order": {
                  "_key" : "asc" 
                }
             }
          }
       }

      }
    });

   
    res.status(200).json(response['aggregations']['all_indexes']['buckets']);
  
  } catch (error) {
    res.status(500).json(error);
  }
}
 

 exports.autoComplete = async(req ,res)=>{
  try {
   
    if(req.query.prefix == undefined && req.query.options !=undefined)
    {
      /*let data =  req.query.options.join(' ' )
      let countries = data.split(" ,");*/
   
      const response = await client.search({
        index: "profiles",
        body: {
          size : 10,
         // from : req.params.from,
     
         query: {
          "bool": {
            "must": {
              "match_all": {}
            },
            "filter": {
              "terms": {
                "country.filter": req.query.options
              }
            }
          }
        }
        }
      });
    //  res.status(200).json(response['suggest']['profile-suggest'][0]['options']);
    var results =response.hits.hits.map(function (hit) {
      return hit;
    
  });
   
      res.status(200).json(results);
    }
    else if(req.query.prefix !== undefined &&  req.query.options  == undefined)
    {

  
    const response = await client.search({
      index: "profiles",
      body: {
        size : 10,
       // from : req.params.from,
   
       query: {
           
          "multi_match": {
                       "query": req.query.prefix,
                       "type":"cross_fields", 
                       "operator": "and",
                   
                       "fields": ["firstName.autocomplete^10", "lastName.autocomplete"  ]
                   }
     }
      }
    });
  //  res.status(200).json(response['suggest']['profile-suggest'][0]['options']);
  var results =response.hits.hits.map(function (hit) {
    return hit;
  
});
 
    res.status(200).json(results);

  }
  else if(req.query.prefix != undefined && req.query.options  !== undefined)
  {
    

    /*let data =  req.query.options.join(' ' )
    let countries = data.split(" ");*/
    
    const response = await client.search({
      index: "profiles",
      body: {
        size : 10,
       // from : req.params.from,
   
       query: {
        "bool": {
       "must": [
         {
                  "multi_match": 
                {
                     "query": req.query.prefix,
                     "type":"cross_fields", 
                     "operator": "and",
                 
                     "fields": ["firstName.autocomplete^10", "lastName.autocomplete"  ]
                 }
         }]
         ,
       "filter": [
         {
          "terms":{
             "country.filter":req.query.options
           }
         }
         
       ]
        }
   }} 
    });
  //  res.status(200).json(response['suggest']['profile-suggest'][0]['options']);
  var results =response.hits.hits.map(function (hit) {
    return hit;
  
});
 
    res.status(200).json(results);
  }

  } catch (error) {
    res.status(500).json(error);
  }
}