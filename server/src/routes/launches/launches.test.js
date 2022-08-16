const request = require("supertest");
const app = require("../../app");

describe("Getting launches", () => {
  it("should respond with 200 OK status code", async () => {
    await request(app)
      .get("/launches")
      .expect(200)
      .expect("Content-Type", /application\/json/i);
    // expect(response.status).toBe(200);
  });
});
