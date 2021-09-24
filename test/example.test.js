// test.todo("Write a test which adds two numbers");

function sum(a, b) {
    return a + b;
}

describe("Adding two numbers", () => {
    test("adds 1 + 2 to equal 3", () => {
        expect(sum(1, 2)).toBe(3)
    })

    test("adds 2 + 3 to equal 5", () => {
        expect(sum(2, 3)).toBe(5)
    })
})


