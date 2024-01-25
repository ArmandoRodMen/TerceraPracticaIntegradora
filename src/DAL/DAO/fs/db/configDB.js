import mongoose from "mongoose";
import config from "../../../../config.js";
import { logger } from "../../../../logger.js";

const URI = config.MONGO_URI;

mongoose.connect(URI)
.then(()=>logger.information("Conectado a la DB"))
.catch(error => logger.error(error))