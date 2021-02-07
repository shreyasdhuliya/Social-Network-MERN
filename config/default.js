
require('dotenv').config();
 
 const config ={
    mongoURI:  process.env.MONGO_URI,
    jwtToken: process.env.JWT_TOKEN,
    githubClientId:process.env.GITHUB_CLIENTID,
    githubSecret:process.env.GITHUB_SECRET
}

module.exports = config;