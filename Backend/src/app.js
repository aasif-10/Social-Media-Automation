const express = require("express");
const app = express();
const db = require("./config/mongoose-connection");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const healthRoute = require("./routes/healthRoute");

app.use("/health", healthRoute);

module.exports = app;
