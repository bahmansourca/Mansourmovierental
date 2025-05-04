const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    port: 3306,
    socketPath: '/tmp/mysql.sock',
    multipleStatements: true
});

module.exports = {
    execute: async (query, params) => {
        let connection;
        try {
            connection = await pool.getConnection();
            const [results] = await connection.execute(query, params);
            return results;
        } catch (error) {
            console.error('Erreur lors de l\'exécution de la requête:', error);
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
}; 