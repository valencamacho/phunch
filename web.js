var express = require('express'); //
var ejs = require('ejs'); // 
var app = express.createServer(express.logger());

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
valentineImages = ['habit.jpg','bentobox.jpg','folding.jpg'];

cardArray = []; // this array will hold card data from forms

app.get('/', function(request, response) {
    var templateData = { 
        pageTitle : 'Week4-dwd',
        message: 'book',
        images: valentineImages
    };
    
    response.render("card_form.html",templateData);
});

app.post('/', function(request, response){
    console.log("Inside app.post('/')");
    console.log("form received and includes")
    console.log(request.body);
    
    // Simple data object to hold the form data
var newCard = {
        to : request.body.to,
        from : request.body.from,
        message : request.body.message,
        image : request.body.image
    };
    
    // Put this newCard object into the cardArray
    cardArray.push(newCard);
    
    // Get the position of the card in the cardArray
    cardNumber = cardArray.length - 1;
    
    response.redirect('/book/' + cardNumber);
});


app.get('/card/:cardNumber', function(request, response){
    
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