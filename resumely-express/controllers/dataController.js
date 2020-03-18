const express = require("express");
const client = require("./../elasticsearch/connection");




exports.getAllData = async(req ,res)=>{
    let { count } = req.params;
    try {
      if (!count) {
        count = 0;
      }
      const response = await client.search({
        index: "profiles",
        body: {
          from: count,
          size: 21,
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
 