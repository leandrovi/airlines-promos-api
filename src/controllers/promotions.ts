import { Request, Response } from "express";

import { promotionsFeatures } from "@/features/promotions";

export async function listPromotions(request: Request, response: Response) {
  const promotions = await promotionsFeatures.getLastDayPromotions();
  return response.json({ statusCode: 200, data: promotions });
}
