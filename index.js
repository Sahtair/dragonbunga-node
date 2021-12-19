require("dotenv").config();
const express = require("express");
const { Client } = require("pg");

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

app.use(express.json());

app.get("/", function (req, res) {
  res.send("hello world");
});

app.get("/users", function (req, res) {
  client.query("SELECT * from users", (err, response) => {
    console.log(err, response);
    res.send(response.rows);
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
