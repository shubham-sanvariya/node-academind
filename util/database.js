const mysql = require('mysql2');
// creating connection pool = multiple connection 
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: '12345'
});
// promises allows us to write code in a bit more structured way
// we don't have many nested callbacks,instead we can use promise chains 
module.exports = pool.promise();