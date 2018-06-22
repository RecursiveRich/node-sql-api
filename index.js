const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db");

app.use(bodyParser.json());

app.get("/graduates", async function(req, res, next) {
  try {
    const result = await db.query("SELECT * FROM graduates");
    return res.send(result.rows);
  } catch (e) {
    return next(e);
  }
});

app.post("/graduates", async function(req, res, next) {
  try {
    const result = await db.query(
      "INSERT INTO graduates (name) VALUES ($1) RETURNING *",
      [req.body.name]
    );
    return res.send(result.rows[0]);
  } catch (e) {
    return next(e);
  }
});

app.listen(3000, function() {
  console.log("Getting started on port 3000!");
});
