require("dotenv").config();
const express = require("express");
const { Client } = require("pg");

console.log(process.env);

const client = new Client({
  user: process.env.PUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});
client.connect();

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/", function (req, res) {
  client.query("SELECT * from users", (err, res) => {
    console.log(err, res);
    client.end();
  });
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
