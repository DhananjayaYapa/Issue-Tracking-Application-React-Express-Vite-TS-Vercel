const mysql = require('mysql2/promise');

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    idleTimeout: 30000,
    connectTimeout: 2000,
});

//Test database connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        return false;
    }
};

/**
 * Execute a query with parameters
 * @param {string} sql - SQL query string (use ? for parameters)
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} - Query results (rows)
 */
const query = async (sql, params = []) => {
    const [rows] = await pool.execute(sql, params);
    return rows;
};

/**
 * Get a connection from the pool (for transactions)
 * @returns {Promise<Connection>} - Database connection
 */
const getConnection = async () => {
    return await pool.getConnection();
};

module.exports = {
    pool,
    query,
    getConnection,
    testConnection
};
