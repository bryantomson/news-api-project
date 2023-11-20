const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("/general errors", () => {
  test("GET:404 responds with 404: not found for a non-existent path", () => {
    return request(app)
      .get("/not-a-path")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("path not found");
      });
  });
  test("POST:406 responds with 406 when POST request receieved for path where method is not allowed", () => {
    return request(app)
      .post("/api/topics")
      .expect(406)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("method not allowed");
      });
  });
  test("PATCH:406 responds with 406 when PATCH request receieved for path where method is not allowed", () => {
    return request(app)
      .patch("/api/topics")
      .expect(406)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("method not allowed");
      });
  });
  test("DELETE:406 responds with 406 when PATCH request receieved for path where method is not allowed", () => {
    return request(app)
      .patch("/api/topics")
      .expect(406)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("method not allowed");
      });
  });
});

describe("/api/topics", () => {
  test("GET:200 responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
