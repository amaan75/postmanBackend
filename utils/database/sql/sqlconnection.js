const events = require("./events");
const camunda = require("./camunda");
const sql = require("mssql");

const client = async (config) => {
    let pool = null;

    const closePool = async () => {
        try {
            // try to close the connection pool
            await pool.close();

            // set the pool to null to ensure
            // a new one will be created by getConnection()
            pool = null;
        } catch (err) {
            // error closing the connection (could already be closed)
            // set the pool to null to ensure
            // a new one will be created by getConnection()
            pool = null;
            console.log(["error", "data"], "closePool error");
            console.log(["error", "data"], err);
        }
    };

    const getConnection = async () => {
        try {
            if (pool) {
                // has the connection pool already been created?
                // if so, return the existing pool
                return pool;
            }
            // create a new connection pool
            console.log(`config ${JSON.stringify(config,null,2)}`)
            pool = await sql.connect(config);

            // catch any connection errors and close the pool
            pool.on("error", async err => {
                console.log(["error", "data"], "connection pool error");
                console.log(["error", "data"], err);
                await closePool();
            });
            return pool;
        } catch (err) {
            // error connecting to SQL Server
            console.log(["error", "data"], "error connecting to sql server");
            console.log(["error", "data"], err);
            pool = null;
        }
    };

    // this is the API the client exposes to the rest
    // of the application
    return {
        events: await events.register({ sql, getConnection }),
        camunda: await camunda.register({sql,getConnection})
    };
};

module.exports = client;