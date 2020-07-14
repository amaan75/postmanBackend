const dataClient = require("./sqlconnection");
const config = require("../../../config").sql;
const sqlClient = dataClient(config);
console.log("init sql connection", sqlClient)
//promise based sql client
module.exports = sqlClient



