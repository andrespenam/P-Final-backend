import request from "supertest";
import app from "../app.js";
import pool from "../config/db.js";

describe("Orders API", () => {
  const email = `order${Date.now()}@example.com`;
  const password = "123456";

  it("Debe listar pedidos de usuario (requiere token)", async () => {
    // 1) Register
    await request(app)
      .post("/api/auth/register")
      .send({ name: "OrderTest", email, password });

    // 2) Login
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email, password });

    expect(login.statusCode).toBe(200);
    expect(login.body).toHaveProperty("token");

    const token = login.body.token;

    // 3) GET orders con token
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    if (res.body && Array.isArray(res.body.data)) {
      expect(Array.isArray(res.body.data)).toBe(true);
      return;
    }
    expect(Array.isArray(res.body)).toBe(true);
  });
});