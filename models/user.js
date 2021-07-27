const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;
require("dotenv").config();

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate(val) {
            if(!validator.isEmail(val)) {
                throw new Error("Email is not valid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(val) {
            if(val.toLowerCase().includes("password")) {
                throw new Error("Password cant contain the password you security genius")
            }
        }
    },
    role: {
        type: String,
        required: true,
        default: "employee",
    }
})

// hash the password before saving
userSchema.pre("save", async function(next) {
    const user = this

    if(user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
        console.log(user.password)
    }

    next();
})

// Generating JWT Token
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign( {_id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "24h" })


    await user.save()

    return token
}

const User = mongoose.model("User", userSchema);

module.exports = User;