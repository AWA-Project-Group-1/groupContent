import chai from "chai";
import chaiHttp from "chai-http";
import { initializeTestDb, insertTestUser } from "./test.js";
import { pool } from "./db.js";
import app from "../backend/index.js"; 

const { expect } = chai;
chai.use(chaiHttp);

describe("Auth API Tests", () => {
  let token;

  before(async () => {
    await initializeTestDb(); 
    await insertTestUser("testuser@example.com", "password123");
  });

  after(async () => {
    await pool.query("DELETE FROM users WHERE email = 'testuser@example.com'");
    pool.end();
  });

  describe("POST /api/auth/signup", () => {
    it("should sign up a new user", async () => {
      const res = await chai.request(app).post("/api/auth/signup").send({
        email: "newuser@example.com",
        password: "password123",
      });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("userId");
    });

    it("should not sign up with an existing email", async () => {
      const res = await chai.request(app).post("/api/auth/signup").send({
        email: "testuser@example.com",
        password: "password123",
      });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("error", "Email already registered");
    });
  });

  describe("POST /api/auth/signin", () => {
    it("should sign in successfully", async () => {
      const res = await chai.request(app).post("/api/auth/signin").send({
        email: "testuser@example.com",
        password: "password123",
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("token");
      token = res.body.token;
    });

    it("should not sign in with invalid credentials", async () => {
      const res = await chai.request(app).post("/api/auth/signin").send({
        email: "wronguser@example.com",
        password: "wrongpassword",
      });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("error", "User not found");
    });
  });

  describe("DELETE /api/auth/delete-account", () => {
    it("should not delete account without token", async () => {
      const res = await chai.request(app).delete("/api/auth/delete-account");
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("error", "Authorization token required");
    });

    it("should delete account with valid token", async () => {
      const res = await chai
        .request(app)
        .delete("/api/auth/delete-account")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Account deleted successfully");
    });
  });
});
