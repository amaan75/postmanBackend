const utils = require("./sqlqueries");

const register = async ({ sql, getConnection }) => {
    // read in all the .sql files for this folder
    const sqlQueries = await utils.loadSqlQueries("queries");

    const getIds = async () => {
        // get a connection to SQL Server
        const cnx = await getConnection();
        console.log(cnx);

        // create a new request
        const request = await cnx.request();

        // configure sql query parameters

        // return the executed query
        return request.query(sqlQueries.getCamunda);
    };






    return {
        getIds,
    };
};

module.exports = { register };