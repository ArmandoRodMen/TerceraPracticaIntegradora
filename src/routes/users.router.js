import { Router } from "express";
import {
    findUsers,
    findUser,
    deleteUser,
    createUser,
    updateUser,
    findUserByEmail,
    changeRole
} from "../controllers/users.controller.js";

const router = Router();

router.get("/", findUsers);
router.get("/:idUser", findUser);
router.delete("/:idUser", deleteUser);
router.post("/", createUser);
router.put("/:idUser", updateUser); 
router.get("/email/:email", findUserByEmail); 
router.post("/premium/:idUser", changeRole);



export default router;
