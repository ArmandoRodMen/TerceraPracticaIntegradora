import { logger } from "../logger.js";

/*
export const authMiddleware = (req, res, next) =>{
    const {user} = req;
    if(user.email === "adminCoder@coder.com"){
        next();
    }else{
        res.send("Not authorized");
    }
};*/

export const authMiddleware = (roles) => {
    console.log("roles", roles);
    return (req, res, next) => {
        logger.information("roles requiered", roles,"\nyour role:",req.user.role);
        if (!req.user || !roles.includes(req.user.role)) {
            logger.error("Unauthorized access detected:", req.user);
            return res.status(403).json({ error: "Not authorized" });
        }
        next();
    };
};