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
 