const mongoose = require('mongoose');

try{
    mongoose.connect('mongodb+srv://dontknow1213:4sf7PYxGwOlviSPs@cluster0.t1q7ojk.mongodb.net/test?retryWrites=true&w=majority')
}catch(err){
    console.log(err.message)
}

const responseSchema = new mongoose.Schema({
    status: Number,
    message: String,
    image: String,
    data: [
        {
            name: String,
            count: Number,
            object:[
                {
                    name: String,
                    confidence: Number,
                    class: Number
                }
            ]
        }
    ]
});

const responseModel = mongoose.model('response', responseSchema);

module.exports = responseModel