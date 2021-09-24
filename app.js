const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

// app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

const users = require("./routing/user");

app.use("/users", users);

app.get("/", async (req, res) => {
    res.send("Hello Tech-Talk");
})

module.exports = app;