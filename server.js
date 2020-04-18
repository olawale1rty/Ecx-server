const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({exteneded:true}));
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const logger = require('morgan');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8080;


//logging details
//'combined'
logger.token('host', (req, res)=>{
	return req.hostname;
});
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'ecx.log'),{flags: 'a'});
app.use(logger('[:date[web]] :method :host :url :status :res[content-length] - :response-time ms',{ stream: accessLogStream})); 
app.use(logger('dev'));

//routes
let db = {};
let db2 = {};
let db3 = {};
let db4 = {};
let db5 = {};
let db6 = {};
let date = {};
app.post('/signup',(req, res)=>{
    db = req.body;
    // console.log(db);
    //database
	mongoose.connect('mongodb+srv://ecx:backend@ecx-zrcx9.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
	let dbase = mongoose.connection;
	dbase.on('error', console.error.bind(console, 'connection error:'));
	dbase.once('open', function() {
	  // we're connected!
	  let ecxSchema = new mongoose.Schema({
	  	// _id: mongoose.Schema.ObjectId,
	  	// _id: Number,
		email: String,
		username: String,
		names: Array,
		occupation: String,
		password: String,
		lastlogin: Date
	  	});
	  // },{ _id: false});
	  let ecxModel = mongoose.model('ecx',ecxSchema);
	  let inputData = new ecxModel({
	  	names: db.names,
	  	occupation: db.occupation,
	  	username: db.username,
	  	email: db.email,
	  	password: bcrypt.hashSync(db.password, bcrypt.genSaltSync(10)),
	  	lastlogin: date
	  	
	  });
	  inputData.save()
	  	.then(doc =>{
	  		console.log(doc);
	  		res.json("Successfully Signed Up");
	  		
	  	})
	  	.catch(err=>{
	  		console.log(err);
	  	})
	});


    
    let date = new Date();
    // let month = date_signup.getMonth()+1;
    // let date_sign = date_signup.getDate()+"-"+month+'-'+date_signup.getFullYear();
    // let time = date_signup.toLocaleString('en-US', {hour: 'numeric',hour12: true, minute:'numeric', second:'numeric'}) 
    // date = date_sign + "-" + time;
});



// authetication of the login and getuser  
let secret='ecxbackend'; 
//middleware to check if the authetification is correct


let checkToken = (req, res, next)=>{
	try{
		let token = req.headers['authorization'];
		if (token.startsWith('Bearer')){
			token = token.slice(7, token.length);
		}
		if (token){
			jwt.verify(token, secret, (err, decoded)=>{
				if(err){
					return res.json('Token is not valid');
				}else{
					req.decoded = decoded;
					next();
				}
			});
		}
	}catch(error){
		return res.json('Auth token is not supplied');
	}
};
//server that creates the token.


app.post('/login',(req, res)=>{
	db2 = req.body;
	mongoose.connect('mongodb+srv://ecx:backend@ecx-zrcx9.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
	let dbase = mongoose.connection;
	dbase.on('error', console.error.bind(console, 'connection error:'));
	dbase.once('open', function() {
	  // we're connected!
	  let ecxSchema = new mongoose.Schema({
	  	// _id: Object.Id,
		email: String,
		username: String,
		names: Array,
		occupation: String,
		password: String,
		lastlogin: Date
	  });
	  let date = new Date();
	  let ecxModel = mongoose.model('ecx',ecxSchema);
	  

	  if(db2.email == undefined){
	  	  //update the lastlogin
		  ecxModel
				.findOneAndUpdate({
					username: db2.username
				}, {
					lastlogin: date,
					// password: bcrypt.hashSync(db5.password, bcrypt.genSaltSync(10)),
				}, {new: true})
				.then(doc=>{
					// let index = doc[0];
					console.log(doc);
					
				})
				.catch(err=>{
					console.log(err);
					
				})	
		//query for the username
		  ecxModel
			.find({
				username: db2.username
				// email: db2.email
			})
			.then(doc=>{
				let index = doc[0];
				console.log(index);
				
				bcrypt.compare(db2.password,index.password).then((result) => {
				
					if( index.email == db2.email && result ){
						let token_pass = jwt.sign({email: db2.email},
							secret, {expiresIn: '24h'});
						res.json({  
							message:"Authentication Successful",
							token: token_pass});
					}else if(index.username == db2.username && result){
						let token_pass = jwt.sign({password: db2.username},
							secret, {expiresIn: '24h'});
						res.json({  
							message:"Authentication Successful",
							token: token_pass});
					}else{
						res.json( "Login Incorrect" );
					}
		    	});

			})
			.catch(err=>{
				res.json("Login Incorrect");
			})
		}else{
		  //update the lastlogin
		  ecxModel
				.findOneAndUpdate({
					email: db2.email
				}, {
					lastlogin: date,
					// password: bcrypt.hashSync(db5.password, bcrypt.genSaltSync(10)),
				}, {new: true})
				.then(doc=>{
					// let index = doc[0];
					console.log(doc);
					
				})
				.catch(err=>{
					console.log(err);
					
				})	
			//query for the email
		  ecxModel
			.find({
				// username: db2.username
				email: db2.email
			})
			.then(doc=>{
				let index = doc[0];
				console.log(doc);
				
				bcrypt.compare(db2.password,index.password).then((result) => {
				
					if( index.email == db2.email && result ){
						let token_pass = jwt.sign({email: db2.email},
							secret, {expiresIn: '24h'});
						res.json({  
							message:"Authentication Successful",
							token: token_pass});
					}else if(index.username == db2.username && result){
						let token_pass = jwt.sign({password: db2.username},
							secret, {expiresIn: '24h'});
						res.json({  
							message:"Authentication Successful",
							token: token_pass});
					}else{
						res.json( "Login Incorrect" );
					}
		    	});

			})
			.catch(err=>{
				res.json("Login Incorrect");
			})
		}
	  	
	  });

	
});

app.get('/getuser/:Id', checkToken, (req, res)=>{
    db3 = req.params.Id;
    mongoose.connect('mongodb+srv://ecx:backend@ecx-zrcx9.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
	let dbase = mongoose.connection;
	dbase.on('error', console.error.bind(console, 'connection error:'));
	dbase.once('open', function() {
	  // we're connected!
	  let ecxSchema = new mongoose.Schema({
	  	email: String,
		username: String,
		names: Array,
		occupation: String,
		password: String,
		lastlogin: Date
	  });
	  let ecxModel = mongoose.model('ecx',ecxSchema);
	  	  
		  ecxModel
			.find({
				_id: db3
				// email: db2.email
			})
			.then(doc=>{
				let index = doc[0];
				console.log(doc);
				let id = index._id;
			    let email =	index.email;
			    let username = index.username;
			    let names =	index.names;
			    let occupation = index.occupation;
			    let lastlogin =	index.lastlogin
				res.json({
					id,
					email,
					username,
					names,
					occupation,
					lastlogin
					
		    	});
			})
			.catch(err=>{
				res.json("Login Incorrect");
			})
		
	  	
	  });		
    
});

//cannot  delete using the _id so i use the username.
//delete path details
app.delete('/deleteuser/:Id', checkToken, (req, res)=>{
    db4 = req.params.Id;
    mongoose.connect('mongodb+srv://ecx:backend@ecx-zrcx9.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
	let dbase = mongoose.connection;
	dbase.on('error', console.error.bind(console, 'connection error:'));
	dbase.once('open', function() {
	  // we're connected!
	  let ecxSchema = new mongoose.Schema({
	  	email: String,
		username: String,
		names: Array,
		occupation: String,
		password: String,
		lastlogin: Date
	  });
	  let ecxModel = mongoose.model('ecx',ecxSchema);
	  mongoose.set('useFindAndModify', false);
	  
		  ecxModel
			.findOneAndRemove({
				_id: db4
				// username: db4
				// email: db2.email
			})
			.then(doc=>{
				// let index = doc[0];
				console.log(doc);
				// let username = index.username;
				res.json(
					db4 + ' has been deleted.'
					
		    	);
			})
			.catch(err=>{
				// res.json("Login Incorrect");
				console.log(err)
			})
	  	
	  });		
    
});
// update path details
app.put('/updateuser', checkToken, (req, res)=>{
    db5 = req.body;
    mongoose.connect('mongodb+srv://ecx:backend@ecx-zrcx9.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
	let dbase = mongoose.connection;
	dbase.on('error', console.error.bind(console, 'connection error:'));
	dbase.once('open', function() {
	  // we're connected!
	  let ecxSchema = new mongoose.Schema({
	  	email: String,
		username: String,
		names: Array,
		occupation: String,
		password: String,
		lastlogin: Date
	  });
	  let ecxModel = mongoose.model('ecx',ecxSchema);
	  
	  //Assumed that the email is unique and cannot be updated.
	  if(db5.password == undefined){
		//query for the username
		  ecxModel
			.findOneAndUpdate({
				email: db5.email
			}, {
				username: db5.username,
				// password: bcrypt.hashSync(db5.password, bcrypt.genSaltSync(10)),
			}, {new: true})
			.then(doc=>{
				// let index = doc[0];
				console.log(doc);
				let username = doc.username;
				res.json(
					username + ' has been updated Successfully.'
					
		    	);
			})
			.catch(err=>{
				res.json("Login Incorrect");
				
			})
	 }else{
	 	//query for the password
		  ecxModel
			.findOneAndUpdate({
				email: db5.email
			}, {
				// username: db5.username,
				password: bcrypt.hashSync(db5.password, bcrypt.genSaltSync(10))
			}, {new: true})
			.then(doc=>{
				// let index = doc[0];
				console.log(doc);
				
				res.json(
					'Password has been updated Successfully.'
					
		    	);
			})
			.catch(err=>{
				res.json("Login Incorrect");
				
			})
	 }	
	  	
	  });	

    
});

// all users path details

app.get('/alluser/:Id', checkToken, (req, res)=>{
    db6 = req.params.Id;
    mongoose.connect('mongodb+srv://ecx:backend@ecx-zrcx9.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
	let dbase = mongoose.connection;
	dbase.on('error', console.error.bind(console, 'connection error:'));
	dbase.once('open', function() {
	  // we're connected!
	  let ecxSchema = new mongoose.Schema({
	  	username: String,
	  	email: String,
	  	password: String,
	  	time: String,
	  	date: String
	  });
	  
	  ecxSchema.statics.getUsers = function (){
	  	return new Promise((resolve, reject)=>{
	  		this.find((err, docs)=>{
	  			if(err){
	  				console.error(err);
	  				return reject(err)
	  			}
	  			resolve(docs);
	  		})
	  	})
	  }
	  
	  if(mongoose.Types.ObjectId.isValid(db6)){
		  let ecxModel = mongoose.model('ecx',ecxSchema);
		  ecxModel.getUsers()
		  	.then(doc=>{
				// let index = doc[0];
				// console.log(doc);
				
				res.json({
					doc
				})
			})
			.catch(err=>{
				res.json("Login Incorrect");
				// console.log(err);
				
			})
		}else{
			console.log("Invalid Id");
		}
	  
	});

    
});

//logs route
app.get('/logs',(req, res)=>{
	fs.readFile('ecx.log', function(err, data) {
    res.send(data); 
  });	
});

//listen 
app.listen(port, ( ) => {
    console.log(`The server is running on ${port}`);
})