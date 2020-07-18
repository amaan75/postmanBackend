const utils = require("./sqlqueries");

const register = async ({ sql, getConnection }) => {
    // read in all the .sql files for this folder
    const sqlQueries = await utils.loadSqlQueries("queries");

    const executeQuery = async (sql) => {
        // get a connection to SQL Server
        const cnx = await getConnection();


        // create a new request
        const request = await cnx.request();

        // configure sql query parameters

        // return the executed query
        return request.query(sql);
    };






    return {
        executeQuery,
    };
};

module.exports = { register };