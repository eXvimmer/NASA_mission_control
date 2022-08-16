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

describe("Creating launches", () => {
  const validLaunch = {
    mission: "a new mission",
    target: "somewhere far far away",
    rocket: "good one",
    launchDate: "January 4, 2028",
  };

  it("should create a launch object and return 201 Created status code", async () => {
    const response = await request(app)
      .post("/launches")
      .send(validLaunch)
      .expect(201);
    expect(response.body).toMatchObject({
      ...validLaunch,
      launchDate: new Date(validLaunch.launchDate).toISOString(),
    });
  });

  it("should catch missing required properties", async () => {
    const invalidLaunch = { ...validLaunch };
    delete invalidLaunch.rocket;

    const response = await request(app)
      .post("/launches")
      .send(invalidLaunch)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "missing required launch property",
    });
  });

  it("should catch invalid dates", async () => {
    const invalidLaunch = { ...validLaunch, launchDate: "hello" };

    const response = await request(app)
      .post("/launches")
      .send(invalidLaunch)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "invalid launch date",
    });
  });
});
