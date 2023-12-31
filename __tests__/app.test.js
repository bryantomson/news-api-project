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
  test("404: responds with 404: not found for a get request to non-existent path", () => {
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
          comment_count: expect.any(Number),
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
        expect(body.msg).toBe("bad request");
      });
  });

  describe("GET /api", () => {
    test("200: responds with an array of endpoints", () => {
      return request(app)
        .get("/api")
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
  test("200: responds with an array of articles", () => {
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
      });
  });

  describe("GET /api/articles (topic query)", () => {
    test("accepts a topic query which returns articles with specified topic ", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(1);
          expect(articles[0]).toMatchObject({
            article_id: expect.any(Number),
            article_img_url: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            title: expect.any(String),
            topic: "cats",
            votes: expect.any(Number),
          });
        });
    });

    test("200: responds with empty array if the topic exists but there are no articles for that topic", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toEqual([]);
        });
    });
    test("404: responds with error message if that topic does not exist", () => {
      return request(app)
        .get("/api/articles?topic=not-a-topic")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
  });

  describe("GET /api/articles (sort_by query)", () => {
    test("accepts a sort_by=author query which returns articles sorted by author", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              article_img_url: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("author", { descending: true });
        });
    });
    test("accepts a sort_by=article_id query which returns articles sorted by article_id", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              article_img_url: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("article_id", { descending: true });
        });
    });
    test("accepts a sort_by=created_at query which returns articles sorted by created_at", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              article_img_url: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("accepts a sort_by=created_at query which returns articles sorted by created_at", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              article_img_url: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("400: responds with bad request if the sort_by passed is invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=not-a-sort_by")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });

  describe("GET /api/articles (order query)", () => {
    test("accepts a sort_by=author and order=asc query which returns articles sorted by author in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              article_img_url: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("author", { descending: false });
        });
    });
    test("400: responds with bad request if the order passed is invalid", () => {
      return request(app)
        .get("/api/articles?order=not-an-order")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });

  describe("GET /api/articles (combined queries)", () => {
    test("accepts sort_by, order and topic queries combined and returns correpsonding data", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=asc&topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              article_img_url: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              title: expect.any(String),
              topic: "mitch",
              votes: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("author", { descending: false });
        });
    });
    test("400: responds with bad request if any of the queries passed are invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=banana&topic=mitch")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });
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
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test("404: responds with error message if that article_id does not exist", () => {
    return request(app)
      .get("/api/articles/7464/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: responds with 'bad request' if article_id format is incorrect", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: inserts a new comment to the db at the specified article id and sends posted comment back to the client", () => {
    const testComment = {
      username: "rogersop",
      body: "The article 'Living in the Shadow of a Great Man' resonates deeply. It captures the universal struggle of establishing identity alongside an extraordinary figure. The author's insight prompts reflection on personal growth amid the shadows",
    };

    const expected = {
      author: "rogersop",
      body: "The article 'Living in the Shadow of a Great Man' resonates deeply. It captures the universal struggle of establishing identity alongside an extraordinary figure. The author's insight prompts reflection on personal growth amid the shadows",
      article_id: 1,
      comment_id: 19,
      created_at: expect.any(String),
      votes: 0,
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(expected);
      });
  });

  test("404: returns custom error message if the username does not exist in the db", () => {
    const testComment = {
      username: "not-a-user",
      body: "blah blah blah",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual(
          "username not found, please sign up to continue"
        );
      });
  });
  test("404: returns not found if the article_id does not exist in the db", () => {
    const testComment = {
      username: "rogersop",
      body: "blah blah blah",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("not found");
      });
  });

  test("400: returns bad request if the inserted comment does not have the required properties", () => {
    const testComment = {
      username: "rogersop",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request");
      });
  });
});

//TASK 19 - incomplete. 


// describe("POST /api/articles", () => {
//   test("201: inserts a new article to the db posted article back to the client", () => {
//     const testArticle = {
//       author: "icellusedkars",
//       title: "Carrot cake design philosophy",
//       body: "Toasting pecans and using brown sugar can add extra flavor and moisture",
//       topic: "paper",
//       article_img_url:
//         "https://butternutbakeryblog.com/wp-content/uploads/2019/04/carrot-cake-layers.jpg",
//     };

//     return request(app)
//       .post("/api/articles")
//       .send(testArticle)
//       .expect(201)
//       .then(({ body }) => {
//         const { article } = body;
//         expect(article).toEqual(expected);
//       });
//   });

  // test("404: returns custom error message if the username does not exist in the db", () => {
  //   const testComment = {
  //     username: "not-a-user",
  //     body: "blah blah blah",
  //   };
  //   return request(app)
  //     .post("/api/articles/1/comments")
  //     .send(testComment)
  //     .expect(404)
  //     .then(({ body }) => {
  //       expect(body.msg).toEqual(
  //         "username not found, please sign up to continue"
  //       );
  //     });
  // });
  // test("404: returns not found if the article_id does not exist in the db", () => {
  //   const testComment = {
  //     username: "rogersop",
  //     body: "blah blah blah",
  //   };
  //   return request(app)
  //     .post("/api/articles/999/comments")
  //     .send(testComment)
  //     .expect(404)
  //     .then(({ body }) => {
  //       expect(body.msg).toEqual("not found");
  //     });
  // });

  // test("400: returns bad request if the inserted comment does not have the required properties", () => {
  //   const testComment = {
  //     username: "rogersop",
  //   };
  //   return request(app)
  //     .post("/api/articles/1/comments")
  //     .send(testComment)
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.msg).toEqual("bad request");
  //     });
  // });


describe("PATCH /api/articles/:article_id", () => {
  test("200: returns row with votes incremented by given value at sepecified article id", () => {
    const incVotes = { inc_votes: 3 };
    const expected = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: expect.any(String),
      votes: 103,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(incVotes)
      .expect(200)
      .then(({ body }) => {
        const { updated } = body;
        expect(updated).toEqual(expected);
      });
  });

  test("404: responds with error message if that article_id does not exist", () => {
    return request(app)
      .patch("/api/articles/7464")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400: responds with 'bad request' if article_id format is incorrect", () => {
    return request(app)
      .patch("/api/articles/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with 'bad request' if request body is invalid", () => {
    const badBody = { notallowed: "illegal" };
    return request(app)
      .patch("/api/articles/1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: responds with status 204 and no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("404: responds with error message if comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/7464")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });

  test("400: responds with 'bad request' if comment_id format is incorrect", () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: returns row with votes incremented by given value at sepecified comment id", () => {
    const incVotes = { inc_votes: 3 };
    const expected = {
      comment_id: 1,
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      votes: 19,
      author: "butter_bridge",
      article_id: 9,
      created_at: expect.any(String),
    };
    return request(app)
      .patch("/api/comments/1")
      .send(incVotes)
      .expect(200)
      .then(({ body }) => {
        const { updated } = body;
        expect(updated).toEqual(expected);
      });
  });

  test("404: responds with error message if that comment_id does not exist", () => {
    return request(app)
      .patch("/api/comments/7464")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400: responds with 'bad request' if comment_id format is incorrect", () => {
    return request(app)
      .patch("/api/comments/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with 'bad request' if request body is invalid", () => {
    const badBody = { notallowed: "illegal" };
    return request(app)
      .patch("/api/comments/1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("/api/users/:username", () => {
  test("200: returns a user object with given username", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual({
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
      });
  });
  test("404: sends not found when given a non-existent username", () => {
    return request(app)
      .get("/api/users/not-a-user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});
