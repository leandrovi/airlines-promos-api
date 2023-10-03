import request from "supertest";
import { app } from "../../index";

describe("GET /health", () => {
  it("should respond with json containing airlines promos message", async () => {
    const response = await request(app).get("/health");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("data");
  });
});
