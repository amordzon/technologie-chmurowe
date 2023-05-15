const express = require("express");
const bodyParser = require("body-parser");
const redis = require("ioredis");
const { Pool } = require("pg");

// Konfiguracja połączenia z Redis
const redisClient = redis.createClient({
  host: "redis",
  port: 6379,
});

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

app.post("/message", (req, res) => {
  const { message } = req.body;
  redisClient.rpush("messages", message, (err, reply) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Błąd serwera");
    }
    console.log(`Dodano wiadomość: ${message}`);
    res.send("Wiadomość została dodana");
  });
});

app.get("/message", (req, res) => {
  redisClient.lrange("messages", 0, -1, (err, reply) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Błąd serwera");
    }
    console.log(`Odczytano wiadomości: ${reply}`);
    res.send(reply);
  });
});

app.listen(3000, () => {
  console.log("Serwer działa na porcie 3000");
});
