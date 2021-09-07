const request = require("supertest");
const app = require("../app");
const server = require("../server");
const mongoose = require("mongoose");
require("dotenv").config();

// Close connection after test is done
afterAll(async () => await server.close());
afterAll(async () => await mongoose.disconnect());

let token;
let id;

beforeAll(async () => {
    request(app).post("/users/login").send({name: process.env.ACCOUNT_USERNAME, password: process.env.ACCOUNT_USERNAME_PW })
        .end((err, res) => {
            token = res.body.token
            id = res.body.user._id
        })
})

// Root Path
describe("Test the GET user login route", () => {
    test("It should response all the user data and a token", () => {
        return request(app)
            .post("/users/login")
            .send({name: process.env.ACCOUNT_USERNAME, password: process.env.ACCOUNT_USERNAME_PW})
            .then(response => {
                expect(response.statusCode).toBe(200);
                // Assertions about the response
                expect(response.body).toMatchObject({
                    user: {
                        name: process.env.ACCOUNT_USERNAME,
                        email: 'jarmof135@gmail.com',
                    },
                })
            });
    });
});

describe("Update the User", () => {
    test("It should response the User with the new Data", () => {
        return request(app)
            .patch(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({name: process.env.ACCOUNT_USERNAME + "1"})
            .then(response => {
                expect(response.statusCode).toBe(200);
                // Assertions about the response
                expect(response.body.name).toEqual(process.env.ACCOUNT_USERNAME + "1")
            })
    })
})

describe("Update User Date to the old name", () => {
    test("It should return the User with the old Data", () => {
        return request(app)
            .patch(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({name: process.env.ACCOUNT_USERNAME})
            .then(response => {
                expect(response.statusCode).toBe(200);
                // Assertions about the response
                expect(response.body.name).toEqual(process.env.ACCOUNT_USERNAME)
            })
    })
})

/*describe("Delete a user by ID", () => {
    test("It should response in Error Object with a Authorization Message", () => {

    })
})*/