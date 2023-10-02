import { Router } from "express";

import { listPromotions } from "@/controllers/promotions";

export const promotionsRouter = Router();

promotionsRouter.get("/", listPromotions);
