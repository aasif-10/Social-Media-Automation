const express = require("express");
const app = express();
const db = require("./config/mongoose-connection");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieParser({
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
  }),
);

const userModel = require("./models/user-model");
const accountModel = require("./models/account-model");

const healthRoute = require("./routes/healthRoute");
const authRoute = require("./routes/authRoute");
const socialAuthRoute = require("./routes/socialAuthRoute");
const accountRoute = require("./routes/accountRoute");

app.use("/health", healthRoute);
app.use("/api/auth", authRoute);
app.use("/api/social-auth", socialAuthRoute);
app.use("/api/accounts", accountRoute);

module.exports = app;
