const express = require("express");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticate = require("../middleware/authenticate");
const router = express.Router();
require("dotenv").config();

// Authenticate Route
router.post("/login", async (req, res) => {
    try {

        const user = await User.findOne({name: req.body.name});

        // when username is not found in the database
        if(!user) {
            console.log(chalk.red("User was not found in the Database"));
            res.status(401).send({
                title: "user not found",
                error: "invalid credentials"
            })
        }

        const token = await user.generateAuthToken();

        // When password is wrong
        await bcrypt.compare(req.body.password, user.password, (err, response) => {
            // if password is wrong
            if(!response) {
                res.status(401).send({
                    title: "Invalid Credentials",
                })
            } else {
                // if everything is okay send token
                res.status(200).send({
                    token: token,
                    user: user
                })
            }
        })
    } catch(e) {
        console.log(e);
    }
})

// Get all users
router.get("/", authenticate, async (req, res) => {
    try {
        const user = await User.find();
        res.send(user).status(201);
    } catch(e) {
        res.send(e).status(404)
    }
})

// Get one user with the given ID
router.get("/:id", authenticate, async (req, res) => {

    try {

        const user = await User.findById(req.params.id)

        if(!user) {
            res.status(404).send({
                error: "User was not found."
            })
        }

        res.status(200).send(user);

    } catch(e) {

    }
})

// Authenticate jwt token
router.post("/authenticate", async (req, res) => {
    try {
        const token = req.body.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = User.findOne({_id: decodedToken.id});

        if(!user) {
            res.send({
                error: "No User was found with the given token.",
            })
        }

        res.status(200).send({
            isValid: true,
        });

    } catch(e) {
        res.status(404).send({
            error: "JWT not valid."
        });
    }
})

// Create a new user
router.post("/", async (req, res) => {
    try {

        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);

    } catch(e) {
        res.status(404).send(e);
    }
})

// Update a user by ID
router.patch("/:id", authenticate, async (req, res) => {

    const updates = Object.keys(req.body);

    try {
        const user = await User.findByIdAndUpdate(req.params.id);

        // Cycles through keys to update the user at the given value
        updates.forEach((update) => {
            user[update] = req.body[update];
        })

        await user.save();

        if(!user) {
            return res.status(404).send({error: "No User with the given ID was found to update"})
        }

        res.send(user);

    } catch(e) {

    }
})

// Delete a user
router.delete("/:id", authenticate, async (req, res) => {
    try {

        const user = await User.findByIdAndDelete(req.params.id);
        if(!user) {
            res.status(404).send({ error: "There was no user with the given ID" })
        }

        res.status(301).send({ success: "The given user with the ID was deleted"});

    } catch(e) {
        res.status(404).send(e);
    }
})

module.exports = router;