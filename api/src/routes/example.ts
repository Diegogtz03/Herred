import { Router } from "express";
import { getExample } from "../controllers/example";
import { routeCalc } from "../controllers/routeCalc";

const router = Router();

router.get("/example", getExample);
router.post("/calcRoutes", routeCalc);

export default router;
