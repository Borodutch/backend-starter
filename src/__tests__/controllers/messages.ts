import * as request from "supertest";
import * as mongoose from 'mongoose';
import app from '@/app'
// import * as dbHandler from '@/__tests__/dbHandler';
import { MongoMemoryServer } from 'mongodb-memory-server'
import { runMongo } from '@/models/index'

describe("Messages CRUD endpoints", () => {

  const authHeader = {"Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZyZXNoeW1hbmNoYW5AZ21haWwuY29tIiwibmFtZSI6IlZsYWQifQ.k8fdd3DG9fvPiRtYrsNcN1PH2AXOs4C-PoxIwypmKQc"}

  const mongoServer = new MongoMemoryServer()

  beforeAll(async () => {
    runMongo(await mongoServer.getUri())
  })

  beforeEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({})
    }
  })

  afterAll(async () => app.close());

  describe("Create", () => {
    it("should create a message successfully!", async () => {
      const mockMessage = {
        body: "ORARARAOROAOROAROAOROORAOR",
      };

      const { status, body } = await request(app)
        .post("/messages")
        .set(authHeader)
        .send(mockMessage);

      expect(status).toBe(200);
      expect(body.body).toBe(mockMessage.body);
    });
  });

  describe("Read", () => {
    it("should get message successfully", async () => {
      const mockMessage = {
        body: "MUDAMUDAMUDAMUDAMUDAMUDAMUDA",
      };

      const postReponse = await request(app)
        .post("/messages")
        .set(authHeader)
        .send(mockMessage);

      const getResponse = await request(app)
        .get("/messages")
        .set(authHeader)
        .send();

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.length).toBe(1)
      expect(getResponse.body[0]).toBeDefined();
      expect(getResponse.body[0].body).toBe(mockMessage.body);
    });
  });

  describe("Update", () => {
    it("should update a message successfully", async () => {
      const mockMessage = {
        body: "WRRRRRRRRRYYYYYYYYYYYYYYYYY",
      };
      
      const updatedMockMessage = {
        body: "OH MY GOD!"
      }

      const postReponse = await request(app)
        .post("/messages")
        .set(authHeader)
        .send(mockMessage);

      expect(postReponse.status).toBe(200);
      expect(postReponse.body._id).toBeDefined();

      const createdMessageId = postReponse.body._id

      const updateResponse = await request(app)
        .patch(`/messages/${createdMessageId}`)
        .set(authHeader)
        .send(updatedMockMessage);

      expect(updateResponse.status).toBe(204);

      const getResponse = await request(app)
        .get("/messages")
        .set(authHeader)
        .send();

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.length).toBe(1)
      expect(getResponse.body[0]).toBeDefined();
      expect(getResponse.body[0].body).toBe(updatedMockMessage.body);
    });
  });

  describe("Delete", () => {
    it("should delete a message successfully", async () => {
      const mockMessage = {
        body: "ZA WARUDO!",
      };

      const postReponse = await request(app)
        .post("/messages")
        .set(authHeader)
        .send(mockMessage);

      expect(postReponse.status).toBe(200);
      expect(postReponse.body._id).toBeDefined();

      const createdMessageId = postReponse.body._id

      const deleteResponse = await request(app)
        .delete(`/messages/${createdMessageId}`)
        .set(authHeader)
        .send();

      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app)
        .get("/messages")
        .set(authHeader)
        .send();

        expect(getResponse.status).toBe(200);
        expect(getResponse.body.length).toBe(0);
    });
  });

});