const configDev = require('./config.dev');
const configProd = require('./config.prod');

let config;
if(process.env.NODE_ENV === "production"){
   config = configProd;
}else{
   config = configDev;
}

module.exports = config;





