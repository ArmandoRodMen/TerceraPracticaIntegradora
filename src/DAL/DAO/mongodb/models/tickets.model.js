import mongoose from "mongoose";
import passportJWT from "passport-jwt";
import passport from "passport"; // Agrega esta línea para importar passport
import { usersDao } from "../users.dao.js";
import config from "../../../../config.js";

const ExtractJwt = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
    },
    purchase_datetime: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    /*
    purchaser: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users",
    },*/
});

export const ticketsModel = mongoose.model("tickets", ticketsSchema);

// JWT Strategy
passport.use(
    "jwt",
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.SECRET_KEY_JWT,
        },
        async function (jwt_payload, done) {
            try {
                // Asociar el email con el campo purchaser
                const user = await usersDao.findByEmail(jwt_payload.email);
                if (!user) {
                    return done(null, false, { message: "Usuario no encontrado" });
                }

                return done(null, { _id: user._id, email: user.email });
            } catch (error) {
                return done(error, false, { message: "Error al autenticar usuario" });
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await usersDao.findById(id);
        done(null, { _id: user._id, email: user.email });
    } catch (error) {
        done(error);
    }
});
