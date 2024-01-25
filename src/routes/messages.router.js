import { Router } from "express";
import {
    findMessages,
    createMessage
} from "../controllers/messages.controller.js";

const router = Router();

router.get("/", findMessages);
router.post("/",createMessage);

export default router;
