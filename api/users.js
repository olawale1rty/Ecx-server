const express = require("express");
const router = express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const transactions = require('../model/transactions');

//routes
let db = {};
let db2 = {};
let db3 = {};
let db4 = {};
let db5 = {};
let db6 = {};
// let date = {};
router.post('/signup',(req, res)=>{
    db = req.body;
    let date = new Date();
	  let inputData = new User({
  		// _id: new mongoose.Types.ObjectId(),
	  	names: db.names,
	  	username: db.username,
	  	email: db.email,
	  	password: bcrypt.hashSync(db.password, bcrypt.genSaltSync(10)),
	  	phoneNumber: db.phoneNumber,
	  	transactionPin: db.transactionPin,
	  	lastlogin: date,
	  });
	  let transact = new transactions({
	  	sentAmount: 0,
	  	sentDate: date,
	  	receiverNumber: 0,
	  	saveAmount: 0,
	  	saveDate: date,
	  	transactionLogs: 0,
	  	totalSave: 0,
	  	totalSent: 0
	  });
	  inputData.transaction.push(transact);
	  console.log(inputData.transaction);
	  transact.save();
	  inputData.save()
	  	.then(doc =>{
	  		console.log(doc);
	  		res.json("Successfully Signed Up");
	  		
	  	})
	  	.catch(err=>{
	  		console.log(err);
	  	})
});


    
   
    // let month = date_signup.getMonth()+1;
    // let date_sign = date_signup.getDate()+"-"+month+'-'+date_signup.getFullYear();
    // let time = date_signup.toLocaleString('en-US', {hour: 'numeric',hour12: true, minute:'numeric', second:'numeric'}) 
    // date = date_sign + "-" + time;



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


router.post('/login',(req, res)=>{
	  db2 = req.body;
	  let date = new Date();
	  if(db2.email == undefined){
	  	  //update the lastlogin
		  User
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
		  User
			.find({
				username: db2.username
				// email: db2.email
			})
			.then(doc=>{
				let index = doc[0];
				console.log(index);
				let id = index._id;
				bcrypt.compare(db2.password,index.password).then((result) => {
				
					if( index.email == db2.email && result ){
						let token_pass = jwt.sign({email: db2.email},
							secret, {expiresIn: '24h'});
						res.json({  
							message:"Authentication Successful",
							token: token_pass,
							_id:  id});
					}else if(index.username == db2.username && result){
						let token_pass = jwt.sign({password: db2.username},
							secret, {expiresIn: '24h'});
						res.json({  
							message:"Authentication Successful",
							token: token_pass,
							_id: id});
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
		  User
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
		  User
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

	

router.get('/getuser/:Id', checkToken, (req, res)=>{
    db3 = req.params.Id;	  
	  User
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
		    let lastlogin =	index.lastlogin;
		    let phoneNumber = index.phoneNumber
			res.json({
				id,
				email,
				username,
				names,
				lastlogin,
				phoneNumber
				
	    	});
		})
		.catch(err=>{
			res.json("Login Incorrect");
		})		
	});		

//cannot  delete using the _id so i use the username.
//delete path details
router.delete('/deleteuser/:Id', checkToken, (req, res)=>{
    db4 = req.params.Id;
		  User
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

router.delete('/deleteTransaction/:Id', checkToken, (req, res)=>{
    db4 = req.params.Id;
		  transactions
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
// update path details
router.put('/updateuser', checkToken, (req, res)=>{
    db5 = req.body;  
	  //Assumed that the email is unique and cannot be updated.
	  if(db5.password == undefined){
		//query for the username
		  User
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
		  User
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
// all users path details
router.get('/alluser/', checkToken, (req, res)=>{
			User
			.find()
			.then(doc=>{
				console.log(doc);	
				res.json({
					doc
				})
			})
			.catch(err=>{
				res.json("Login Incorrect");
				// console.log(err);
				
			})	  
});
//save fund route

router.post("/save", checkToken, (req, res)=>{
	const db7 = req.body;
	let save = 0;
	save += db7.save;
	console.log(save);
	console.log(db7)
	let date = new Date();
	transactions
		.findOneAndUpdate({
			_id: db7._id
		}, {
			saveAmount: db7.save,
	  		saveDate: date,
	  		totalSave: save
		}, {new: true})
		.then(doc=>{
			// let index = doc[0];
			console.log(doc);
			res.json(
				db7.save + ' has been saved Successfully.'
				
	    	);
		})
		.catch(err=>{
			res.json("Login Incorrect");
			
		})
})
// transfer
router.post("/transferFunds", checkToken, (req, res)=>{
	const db8 = req.body;
	let sent = 0;
	sent += db8.sentAmount;
	let date = new Date();
	transactions
		.findOneAndUpdate({
				_id: db8._id
			}, {
				sentAmount: db8.sentAmount,
		  		saveDate: date,
		  		totalSent: sent,
		  		receiverNumber: db8.receiverNumber,
		  		transactionLogs: [date, db8.sendPhoneNumber, sent, db8.receiverNumber, 'debit']

			}, {new: true})
			.then(doc=>{
				User
			  	.find({
			  		phoneNumber: db8.sendPhoneNumber
			  	})
			  	.populate("transaction")
			  	.exec((err, doc)=>{
			  		if (err) return "Invalid Phone number"
					let index = doc[0].transaction[0];
					console.log(index);
					
					if (db8.sentAmount > index.totalSave){
						res.json("Insufficient Balance");
					}else{
						res.json("Transaction Pin Successful. " + db8.sentAmount + ' has been sent Successfully'
							);
					}
				})
				// console.log(doc);
				// res.json(
				// 	db8.sent + ' has been sent Successfully.'
					
		  //   	);
			})
			.catch(err=>{
				res.json("Login Incorrect");
				
			})  	
})

//balance
router.get("/balance", checkToken, (req, res)=>{
	let db8 = req.query.Id;
	console.log(db8)
	transactions
	.find({
		_id: db8
	})
	.then(doc=>{
		let index = doc[0];
		console.log(doc);
		let saveAmount = index.totalSave;
		let sentAmount = index.totalSent;
		let balance = saveAmount - sentAmount;
		res.json("Balance is " + balance);
	})
	.catch(err=>{
		res.json("Login Incorrect");
		console.log(err);
	})	
})

router.get('/getUserTransactions/:Id', checkToken, (req, res)=>{
    db3 = req.params.Id;	  
	  transactions
		.find({
			_id: db3
			// email: db2.email
		})
		.then(doc=>{
			let index = doc[0];
			console.log(doc);
			res.json({
				index
	    	});
		})
		.catch(err=>{
			res.json("Login Incorrect");
		})		
	});		

//transactions
router.get('/getAllTransactions/', checkToken, (req, res)=>{
	  
	  transactions
			.find()
			.then(doc=>{
				console.log(doc);	
				res.json({
					doc
				})
			})
			.catch(err=>{
				res.json("Login Incorrect");
				// console.log(err);
				
			})	  
});
	

module.exports = router