const express = require('express');
const app = express();
// const jwt = require('jsonwebtoken');
app.use(express.json());
app.use(express.urlencoded({exteneded:true}));
// const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
const logger = require('morgan');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8080;
require('./database');


//logging details

logger.token('host', (req, res)=>{
	return req.hostname;
});
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'ecx.log'),{flags: 'a'});
app.use(logger('[:date[web]] :method :host :url :status :res[content-length] - :response-time ms',{ stream: accessLogStream})); 
app.use(logger('dev'));

//api call
const users = require("./api/users");
app.use('/',users);

app.get('/logs',(req, res)=>{
	fs.readFile('ecx.log', function(err, data) {
    res.send(data); 
  });	
});

//public files
app.use(express.static(path.join(__dirname,'/public')));

//welcome page
app.get(['/','/index.html'],(req, res)=>{
	res.sendFile(path.join(__dirname,'/public/ecx.html'));
})



//listen 
app.listen(port, ( ) => {
    console.log(`The server is running on ${port}`);
})