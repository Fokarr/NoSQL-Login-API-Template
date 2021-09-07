const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

module.exports.closeDatabase = async() => {
    await mongoose.disconnect();
}
