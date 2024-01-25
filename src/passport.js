import passport from "passport";
import { usersDao } from "./DAL/DAO/mongodb/users.dao.js";
import { cartsDao } from "./DAL/DAO/mongodb/carts.dao.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { hashData, compareData } from "./utils.js";
import { ExtractJwt, Strategy as JWTStrategy} from "passport-jwt";
import config from "./config.js";
import { logger } from "./logger.js";

//local
passport.use(
    "signup", 
    new LocalStrategy(
        {passReqToCallback:true},
        async (req, username, password, done)=>{
        const { first_name, last_name, email } = req.body;
        if (!first_name || !last_name || !email || !password || !username) {
            return done(null, false);
        }
        try {
            const createdCart = await cartsDao.createCart();
            const role = email === "adminCoder@coder.com" ? "admin" : "user";
            const hashedPassword = await hashData (password);
            const createdUser = await usersDao.createOne({
                ...req.body, 
                password: hashedPassword,
                role: role,
                cart: createdCart,
        });
        logger.information(createdUser);
        done(null, createdUser);
        }catch(error){
            done(error);
        }
}));

passport.use("login", new LocalStrategy({usernameField: "email"},async(email, password, done)=>{
    if (!email || !password) {
        done(null, false);
    }
    try {
        const user = await usersDao.findByEmail(email);
        if (!user) {
            return done(null, false);       
        }
        const isPasswordValid = await compareData(password, user.password);
        if (!isPasswordValid) {
            return done(null, false);
        }
        /*
        const userId = user.id;
        console.log("userId", userId);
        const sessionInfo = (email === "adminCoder@coder.com" && password === "adminCod3r123")
            ? { email, first_name: user.first_name, isAdmin: true, isUser: false, userId}
            : { email, first_name: user.first_name, isAdmin: false, isUser: true, userId };
        req.session.user = sessionInfo;
        */
        
        //res.redirect(`/profile/${userId}`);
        done(null,user);
    } catch (error) {
        done(error);
    }
}));

//github

passport.use(
    "github",
    new GithubStrategy(
    {
    clientID: "Iv1.631bd19c0e40fa18",
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/sessions/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try{
        const userDB = await usersDao.findByEmail(profile._json.email);
        if(userDB){
            if(userDB.isGithub){
                return done(null, userDB);
            }else{
                return done(null, false);
            }
        }
        const infoUser={
            first_name:profile._json.name.split(" ")[0],
            last_name:profile._json.name.split(" ")[1],
            email:profile._json.email,
            username:profile._json.login,
            password: " ",
            isGithub: true,
        }
        logger.infromation("infoUser: ",infoUser);
        const createdUser = await usersDao.createOne(infoUser);
        done(null, createdUser);
    }catch(error){
        done(error);
    }
}));

//google
passport.use(
    "google", 
    new GoogleStrategy(
    {
        clientID:     "857566804537-26m63sqqp1tirpkpeqa08kgh4is0vi43.apps.googleusercontent.com",
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/auth/google/callback",
        usernameField: 'email',
    },
    async function(accessToken, refreshToken, profile, done) {
        try{
            const userDB = await usersDao.findByEmail(profile._json.email);
            if(userDB){
                if(userDB.isGoogle){
                    return done(null, userDB);
                }else{
                    return done(null, false);
                }
            }
            const infoUser={
                first_name:profile._json.given_name,
                last_name:profile._json.family_name,
                email:profile._json.email,
                username: profile._json.email,
                password: " ",
                isGoogle: true,
            }
            logger.information(infoUser);
            const createdUser = await usersDao.createOne(infoUser);
            done(null, createdUser);
        }catch(error){
            done(error);
        }
    }
));

const current = (req) =>{
    return req.cookies.token;
};

//JWT
passport.use("jwt", 
    new JWTStrategy({
        //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        jwtFromRequest: ExtractJwt.fromExtractors([current]),
        secretOrKey: config.SECRET_KEY_JWT,
}, async function (jwt_payload, done) {
    logger.information("jwt: ",jwt_payload.email);
        done(null,jwt_payload);
}));

passport.serializeUser((user, done) =>{
    done(null, user._id);
});

passport.deserializeUser(async (id, done) =>{
    try{
        const user = await usersDao.findById(id);
        done(null, user);
    }catch(error){
        done(error);
    }
});

/*
//local
passport.use(
    "signup", 
    new LocalStrategy(
        {passReqToCallback:true},
        async (req, username, password, done)=>{
        const { first_name, last_name, email } = req.body;
        if (!first_name || !last_name || !email || !password || !username) {
            return done(null, false);
        }
        try {
            const hashedPassword = await hashData (password);
            const createdUser = await usersManager.createOne({
                ...req.body, 
                password: hashedPassword,
        });
        done(null, createdUser);
        
        const userId = createdUser.id; 
        const redirectUrl = `/profile/${userId}`;
        //res.redirect(redirectUrl);
        
        }catch(error){
            done(error);
        }
}));
*/