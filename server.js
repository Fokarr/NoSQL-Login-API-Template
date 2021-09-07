const express = require("express");
const app = require("./app");
const cors = require("cors");
const morgan = require("morgan");
const chalk = require("chalk");
const mongoose = require("mongoose");
const port = 3001;
require("dotenv").config();

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log(chalk.green.bold("Connected to Database"));
});

let server = app.listen(port, () => {
    console.log("Server starting on Port: " + port);
})

module.exports = server;


