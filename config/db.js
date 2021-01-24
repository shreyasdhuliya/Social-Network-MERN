
const mongoose  = require('mongoose');
const config = require('config');
const db = config.get('mongoURI')

//mongoose.connect(db)

const connectDB = async () => {
    try{
       await mongoose.connect(db, {
           useNewUrlParser:true,
           useUnifiedTopology: true,
           useCreateIndex: true,
           useFindAndModify: false 
       });
       console.log('mongodb connected...')
    }catch(err){
        console.log("err:", err)

        //exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;