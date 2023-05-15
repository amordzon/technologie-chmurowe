const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const pool = new Pool({
  user: "user",
  host: "db",
  database: "db",
  password: "pass",
  port: 5432,
});

pool.connect();
pool.query(
  "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL);"
);

const app = express();
app.use(bodyParser.json());

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    const users = result.rows;

    res.send(users);
  } catch (err) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    const newUser = result.rows[0];

    res.send(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Serwer działa na porcie 3000");
});
