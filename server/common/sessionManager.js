const moment = require('moment');
const config = require('../config');
let sessionStorage = {}

module.exports = {
    isValid: (id) => {
        if(sessionStorage[id] && sessionStorage[id].add(config.sessionExpireMinutes,'m').isAfter(moment())){
            sessionStorage[id] = moment();
            return true;
        }
        else {
            delete sessionStorage[id];
            return false;
        }
    },
    add: (id) => {
        sessionStorage[id] = moment();
    },
    remove: (id) => {
        delete sessionStorage[id];
    }
    
};