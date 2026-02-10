import request from "supertest";
import app from "../app.js";

describe("Products API", () => {
  it("Debe obtener todos los productos", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
