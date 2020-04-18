const express = require("express");
const client = require("./../elasticsearch/connection");

exports.bulkApi=async(req,res)=>{
  const data = req.body;
  console.log(data)
  let bulkBody = [];

  data.forEach(item => {
    bulkBody.push({
      index: { _index: 'profiles', _type: 'profile' } 
    });      
    bulkBody.push(item);

  });

client.bulk(
  {body: bulkBody},
  function(err, response) {
    if (err) { console.log(err); return; }
    console.log(`Inside bulk3...`);
    let errorCount = 0;
    response.items.forEach(item => {
      if (item.index && item.index.error) {
        console.log(++errorCount, item.index.error);
      }
    });
    console.log(`Successfully indexed ${data.length - errorCount} out of ${data.length} items`);
  })
}


exports.getAllData = async(req ,res)=>{
   
    try {
     
      const response = await client.search({
        index: "profiles",
        body: {
          size : 10,
          from : req.params.from,
          "sort" : [
        
            { "firstName" : "asc" }
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
                "field": "country",
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

 

  
 


  try {
   
    if(req.query.prefix == undefined && req.query.options !=undefined)
    {
        
      console.log(req.query.options)

      let data =  req.query.options.join(' ' )
      let countries = data.split(" ");
      console.log(countries)
      const response = await client.search({
        index: "profiles",
        body: {
          size : 50,
         // from : req.params.from,
     
         query: {
          "bool": {
            "must": {
              "match_all": {}
            },
            "filter": {
              "terms": {
                "country": countries
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
        size : 50,
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
    console.log(req.query.options)

    let data =  req.query.options.join(' ' )
    let countries = data.split(" ");
    console.log(countries)
    const response = await client.search({
      index: "profiles",
      body: {
        size : 50,
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
             "country":countries
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