const mongoose = require('mongoose');


const connectDb= (URL)=>{
    mongoose.connect(URL)


}


module.exports = connectDb;


