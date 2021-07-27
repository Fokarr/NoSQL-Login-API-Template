const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = User.findOne({_id: decoded.id});

        if(!user) {
            throw new Error("Unauthorized");
        }

        req.user = user;
        next();

    } catch(e) {
        res.status(401).send({error: "Please authenticate"})
    }
}

module.exports = authenticate;