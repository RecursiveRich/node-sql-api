const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql://localhost/node-relational"
});

client.connect();

module.exports = client;
