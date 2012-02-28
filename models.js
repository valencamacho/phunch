// export Schemas to web.js
module.exports.configureSchema = function(Schema, mongoose) {
    
    // Book  
    var Books = new Schema({
      nameto     : String
    , namefrom   : String
    , recommend   : String
    , image       : String
    , date      : { type: Date, default: Date.now }
       });

    // add schemas to Mongoose
    mongoose.model('Books', Books);

};