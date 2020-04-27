const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ecx:backend@ecx-zrcx9.mongodb.net/test?retryWrites=true&w=majority', {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true})
	.then(()=> console.log("Database Connected Successfully"))
	.catch(err=>console.log(err));
	
// mongodb://localhost/signup


