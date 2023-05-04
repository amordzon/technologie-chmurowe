const express = require("express");
const bodyParser = require("body-parser");
const redis = require("ioredis");

// Konfiguracja połączenia z Redis
const redisClient = redis.createClient({
  host: "redis",
  port: 6379,
});

const app = express();
app.use(bodyParser.json());

// Dodanie wiadomości do Redis
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

// Odczytanie wiadomości z Redis
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
