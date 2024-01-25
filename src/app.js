import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/users.router.js";
import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import messageRouter from "./routes/messages.router.js";
import cookieRouter from "./routes/cookie.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import session from "express-session";
import "./passport.js";
import passport from "passport";
import fileStore from "session-file-store";
const FileStore = fileStore(session);
import MongoStore from "connect-mongo";
import "../src/DAL/DAO/fs/db/configDB.js";
import config from "./config.js";
import cors from "cors";
import { generateProuct } from "./faker.js";
import { errorMiddleware } from "./middlewares/errors.middleware.js";
import { logger } from "./logger.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("SecretCookie"));
app.use(express.static(__dirname + "/public"));
app.use(cors());

const URI = config.MONGO_URI;

//const URI = "mongodb+srv://ArmandoRod:coderhouse@cluster0.yl8erzs.mongodb.net/ecommerce?retryWrites=true&w=majority";

//mongo
app.use(
    session({
        store: new MongoStore({
            mongoUrl: URI,
        }), 
        secret: "secretSession", 
        cookie:{maxAge:60000},
    })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/cookie", cookieRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/api/chat", messageRouter);
app.use("/", viewsRouter);

app.get("/mockingproducts",(req, res) =>{
    const products = [];
    for (let i=0; i<100; i++) {
        const product = generateProuct();
        products.push(product);
    }
    res.json({products});
});

app.get("/loggerTest", (req, res) => {
    logger.debug("Prueba debug");
    logger.http("Prueba http");
    logger.information("Prueba information"); 
    logger.warning("Prueba warning");
    logger.error("Prueba error");
    logger.fatal("Prueba de Error");
    res.send("Logger test completed");
});

app.listen(8080, () => {
    logger.information("Escuchando puerto 8080 con logger");
    logger.error("Test error");
});

app.use(errorMiddleware);