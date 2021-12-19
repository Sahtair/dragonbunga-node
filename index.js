require("dotenv").config();
const express = require("express");
const { Validator } = require("express-json-validator-middleware");
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

app.use((req, res, next) => {
  if (req.method === "POST") {
    const { data } = req.body;
    if (!data.email) {
      req.body.data.email = "";
    }
  }
  next();
});

app.get("/", function (req, res) {
  res.send("hello world");
});

app.get("/users", async function (req, res) {
  const response = await client.query("SELECT * from users");
  res.send(response.rows);
});

app.get("/users/:userId", async function (req, res) {
  const response = await client.query(
    `SELECT * from users where user_id = ${req.params.userId}`
  );
  res
    .status(response.rowCount ? 200 : 404)
    .send(response.rows?.[0] ?? "User not found");
});

const validateBody = new Validator();
const bodySchema = require("./postBodySchema.json");

app.post("/users", validateBody({ body: bodySchema }), async (req, res) => {
  const { data } = req.body;

  try {
    await client.query(
      "INSERT INTO users(name, surname, email) VALUES ($1, $2, $3)",
      Object.values(data)
    );
  } catch (e) {
    console.log(e);
    return res.send(500, "something went wrong", e);
  }

  res.send("Inserted user");
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
