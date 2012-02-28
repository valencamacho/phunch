// export Schemas to web.js
module.exports.configureSchema = function(Schema, mongoose) {
    
    // Book  
    var Book = new Schema({
      nameto     : String
    , namefrom   : String
    , recommend   : String
    , image       : String
    , bookNumber  : Number
    , date      : { type: Date, default: Date.now }
       });

    // add schemas to Mongoose
    mongoose.model('Book', Book);

};