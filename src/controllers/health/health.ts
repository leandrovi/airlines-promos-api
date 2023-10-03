import { Request, Response } from "express";

export async function healthCheck(request: Request, response: Response) {
  return response.json({
    statusCode: 200,
    data: `Airlines Promos is running. Timestamp: ${new Date()}`,
  });
}
