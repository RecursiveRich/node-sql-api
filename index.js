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
      "INSERT INTO graduates (name, fun_fact, fav_num) VALUES ($1) RETURNING *",
      [req.body.name]
    );
    return res.send(result.rows[0]);
  } catch (e) {
    return next(e);
  }
});

app.patch("/graduates/:id", async function(req, res, next) {
  try {
    const result = await db.query(
      "UPDATE graduates SET name=$1 WHERE id=$2 RETURNING *",
      [req.body.name, req.params.id]
    );
    return res.send(result.rows[0]);
  } catch (e) {
    return next(e);
  }
});

app.delete("/graduates/:id", async function(req, res, next) {
  try {
    const result = await db.query(
      "DELETE FROM graduates WHERE id=$1 RETURNING *",
      [req.params.id]
    );
    return res.send(result.rows[0]);
  } catch (e) {
    return next(e);
  }
});

app.get("/graduates/:id/offers", async function(req, res, next) {
  try {
    const graduate = await db.query("SELECT * FROM graduates WHERE id=$1", [
      req.params.id
    ]);
    const offers = await db.query(
      "SELECT company,title FROM offers WHERE graduate_id=$1",
      [req.params.id]
    );
    graduate.rows[0].offers = offers.rows;
    return res.send(graduate.rows[0]);
  } catch (e) {
    return next(err);
  }
});

app.post("/graduates/:id/offers", async function(req, res, next) {
  try {
    const result = await db.query(
      "INSERT INTO offers (company, title, graduate_id) VALUES ($1, $2, $3) RETURNING *",
      [req.body.company, req.body.title, req.params.id]
    );
    // const graduate = await db.query("SELECT * FROM graduates WHERE id=$1", [
    //   req.params.id
    // ]);
    // const offers = await db.query(
    //   "SELECT company,title FROM offers WHERE graduate_id=$1",
    //   [req.params.id]
    // );
    // graduate.rows[0].offers = offers.rows;
    return res.send(result.rows[0]);
  } catch (e) {
    return next(err);
  }
});

app.listen(3000, function() {
  console.log("Getting started on port 3000!");
});
