var express = require('express'); //
var ejs = require('ejs'); // 
var app = express.createServer(express.logger());

var http = require('http');

var mongoose = require('mongoose'); // include Mongoose MongoDB library
var schema = mongoose.Schema; 

/************ DATABASE CONFIGURATION **********/
app.db = mongoose.connect(process.env.MONGOLAB_URI); //connect to the mongolabs database - local server uses .env file

// Include models.js - this file includes the database schema and defines the models used
require('./models').configureSchema(schema, mongoose);

// Define your DB Model variables
var Book = mongoose.model('Book');

/************* END DATABASE CONFIGURATION *********/


/*********** SERVER CONFIGURATION *****************/
app.configure(function() {
    
    /*********************************************************************************
        Configure the template engine
        We will use EJS (Embedded JavaScript) https://github.com/visionmedia/ejs
        
        Using templates keeps your logic and code separate from your HTML.
        We will render the html templates as needed by passing in the necessary data.
    *********************************************************************************/

    app.set('view engine','ejs');  // use the EJS node module
    app.set('views',__dirname+ '/views'); // use /views as template directory
    app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
    app.register('html',require('ejs')); //use .html files in /views

    /******************************************************************
        The /static folder will hold all css, js and image assets.
        These files are static meaning they will not be used by
        NodeJS directly. 
        
        In your html template you will reference these assets
        as yourdomain.heroku.com/img/cats.gif or yourdomain.heroku.com/js/script.js
    ******************************************************************/
    app.use(express.static(__dirname + '/static'));
    
    //parse any http form post
    app.use(express.bodyParser());
    
    /**** Turn on some debugging tools ****/
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

});
/*********** END SERVER CONFIGURATION *****************/

// images for people to choose from, all images in /static/img
bookImages = ['habit.jpg','bentobox.jpg','folding.jpg'];

bookArray = []; // this array will hold card data from forms



app.get('/', function(request, response) {

 var templateData = { 
        pageTitle :'Week4-dwd',
        message: 'book',
        images: bookImages
    };
    
    response.render("card_form.html",templateData);
});




// Display a single blog post
app.get('/book/:objectid',function(request, response){
    
    // Get the request blog post by objectid
    Book.findById(request.params.objectid,function(err,post){
        if (err) {
            console.log('error');
            console.log(err);
            response.send("uh oh, can't find that book recommendation");
        }
        
        templateData = {
        	post : post
        }
     
          
         console.log(post);

        
        // found the blogpost
        response.render('card_display.html', templateData);
    });
});



app.post('/', function(request, response){
    console.log("Inside app.post('/')");
    console.log("form received and includes")
    console.log(request.body);
    
    // Simple data object to hold the form data
    
var newEntry = {
        nameto : request.body.nameto,
        namefrom : request.body.namefrom,
        recommend : request.body.recommend,
        image : request.body.image,
        //bookNumber : request.body.number,
    };
    
    
     // create a new entry
    var entry = new Book(newEntry);
    
    // save the new entry
    entry.save();
    

	response.redirect('/book/'+ entry._id);
 
});


app.get('/book/:imageName', function(request, response){
    
    // building image name eg. bentobox + .jpg = bentobox.jpg
    var requestedImage = request.params.imageName + ".jpg";
    
    // Get the card from cardArray
	Book.find({image : requestedImage}, function (err, booksData) {
		// books is an array
		if (booksData) {
			
			console.log('got some books');
			console.log(booksData);
			console.log("*****************");
			
		    var templateData = {
		    	books : booksData
		    };
		    
		    // Render the card_display template - pass in the cardData
		    response.render("card_list.html", templateData);
		    
		} else {
		    // card not found. show the 'Card not found' template
		    response.render("card_not_found.html");
		    
		}
    
	});
    
});


app.get("/hunchtest",function(request, response) {
	var options = {
	  host: 'www.google.com',
	  port: 80,
	  path: '/',
	  method: 'GET'
	};
	
	var req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	    console.log('BODY: ' + chunk);
	    response.send(chuck);

	  });
	});
	
	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
	
})


// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});