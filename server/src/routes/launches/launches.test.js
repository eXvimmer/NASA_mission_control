const request = require("supertest");
const app = require("../../app");
const { loadPlanetsData } = require("../../models/planets.model");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Getting launches", () => {
    it("should respond with 200 OK status code", async () => {
      await request(app)
        .get("/v1/launches")
        .expect(200)
        .expect("Content-Type", /application\/json/i);
      // expect(response.status).toBe(200);
    });
  });

  describe("Creating launches", () => {
    const validLaunch = {
      mission: "a new mission",
      target: "Kepler-62 f",
      rocket: "good one",
      launchDate: "January 4, 2028",
    };

    it("should create a launch object and return 201 Created status code", async () => {
      const response = await request(app)
        .post("/v1/launches")
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
        .post("/v1/launches")
        .send(invalidLaunch)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "missing required launch property",
      });
    });

    it("should catch invalid dates", async () => {
      const invalidLaunch = { ...validLaunch, launchDate: "hello" };

      const response = await request(app)
        .post("/v1/launches")
        .send(invalidLaunch)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "invalid launch date",
      });
    });
  });
});
