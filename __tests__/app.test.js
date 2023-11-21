const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const fs = require("fs/promises");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("/general errors", () => {
  test("GET 404: responds with 404: not found for a get request to non-existent path", () => {
    return request(app)
      .get("/not-a-path")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("path not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with an array of topics", () => {
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

describe("GET /api/articles/:article_id", () => {
  test("200: responds with the article with specified ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("404: sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/9999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
  test("400: sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  describe("GET /api", () => {
    test("200: responds with an array of endpoints", () => {
      return request(app)
        .get("/api/")
        .expect(200)
        .then(({ body }) => {
          const response = JSON.parse(body);
          fs.readFile("./endpoints.json").then((data) => {
            const expected = JSON.parse(data);
            expect(response).toEqual(expected);
          });
        });
    });
  });
});

describe("GET /api/articles", () => {
  test("GET:200 responds with an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            article_img_url: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
          expect(article.hasOwnProperty("body")).toBe(false);
        });
      })
    })
  })

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy("created_at", {descending: true})
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("200: responds with empty array if the article_id exists but there are no comments with that article_id", () => {
    return request(app)
      .get("/api/articles/3999/comments")
      .expect(200)
      .then(({ body }) => {
        const{comments} = body
        expect(comments).toEqual([])
        
      });
  });

//404: responds with error message if that article_id does not exist
//200: responds with empty array if the article_id exists but there are no comments with that article_id
});
