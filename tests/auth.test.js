import request from "supertest";
import app from "../app.js";
import pool from "../config/db.js";

describe("Auth API", () => {
  const email = `test${Date.now()}@example.com`; 
  const password = "123456";

  it("Debe registrar un nuevo usuario", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test", email, password });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("Debe iniciar sesión con usuario existente", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});