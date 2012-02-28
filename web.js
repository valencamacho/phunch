var express = require('express'); //
var ejs = require('ejs'); // 
var app = express.createServer(express.logger());

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
app.get('/entry/:urlslug',function(request, response){
    
    // Get the request blog post by urlslug
    Book.findOne({urlslug:request.params.urlslug},function(err,post){
        if (err) {
            console.log('error');
            console.log(err);
            response.send("uh oh, can't find that book recommendation");
        }
        
        // use different layout for single entry view
        post.layout = 'card_display.html';
        
        // found the blogpost
        response.render('card_display.html', newEntry);
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
    };
    
    
     // create a new entry
    var entry = new Book(newEntry);
    
    // save the new entry
    entry.save();
    

   /*
 // Put this newCard object into the cardArray
    cardArray.push(newEntry);
    
    // Get the position of the card in the cardArray
    cardNumber = cardArray.length - 1;
*/

    // you have to figure out how to get bookNumber
    response.redirect('/book/' + cardNumber);
 /*
   
    // redirect to show the single post
    response.redirect('/entry/' + Books); // for example /entry/this-is-a-post

*/
});


app.get('/book/:bookNumber', function(request, response){
    
    // Get the card from cardArray
    cardData = cardArray[request.params.cardNumber]
    
    if (cardData != undefined) {
        
        // Render the card_display template - pass in the cardData
        response.render("card_display.html", cardData);
        
    } else {
        // card not found. show the 'Card not found' template
        response.render("card_not_found.html");
        
    }
    
});





// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});