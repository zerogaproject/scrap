const http = require('http');
const express = require('express');
const mongojs = require('mongojs');
const config = require('config');
const app = express();
const db = mongojs(`${config.get('db').host}/${config.get('db').db}`,config.get('db').collections);
const server = http.createServer(app);
server.listen(5000);

app.get('/about',(req,res)=>res.json({about:'me',version:1}));

app.get('/categories',(req,res)=>{
  db.categories.find({},{},(err,docs)=>res.json(docs));
})
