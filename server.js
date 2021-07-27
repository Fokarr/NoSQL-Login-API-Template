const express = require("express");
const app = express();
const users = require("./routing/user");
const cors = require("cors");
const morgan = require("morgan");
const chalk = require("chalk");
const mongoose = require("mongoose");
const port = 3001;

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log(chalk.green.bold("Connected to Database"));
});

app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.send("Hello World");
})

app.listen(port, () => {
    console.log("Server starting on Port: " + port);
})

app.use("/users", users);

