import {
    createSession,
    findByEmail,
    getUserStatus,
    authenticateGitHub,
    callBackGitHub,
    authenticateGoogle,
    callBackGoogle,
    sigOut,
    restore
} from "../services/sessions.services.js";
import CustomError from "../errors/error.generator.js";
import { ErrorMessages } from "../errors/errors.enum.js";
import { logger } from "../logger.js";

export const create= async (req, res) => {
    const { first_name, last_name, email, password, username } = req.body;
    
    if (!first_name || !last_name || !email || !password || !username) {
    return res.status(400).json({ message: "Some data is missing" });
    }
    try {
        const hashedPassword = await hashData(password);
        const existingUser = await findByEmail(email);
        const redirectUrl = `/login`;
        if (existingUser) {
            return res.redirect(redirectUrl);
        }
        const createdUser = await createOne({...req.body, password:hashedPassword});
        const userId = createdUser.id; 
        
        res.redirect(redirectUrl);
    } catch (error) {
        //res.status(500).json({ error });
        CustomError.generateError(
            ErrorMessages.CAN_NOT_CREATE_SESSION,
            500,
            ErrorMessages.CAN_NOT_CREATE_SESSION
        );
    }
};

export const createA = async (req, res) => {
const { email, password } = req.body;
if (!email || !password) {
    return done(null, false, {message: "Some data is missing"});
}
try {
    const user = await findByEmail(email);
    logger.information("user", user);
    if (!user) {
        return done(null, false, {message: "Username is not valid"});
    }
    const isPasswordValid = await compareData(password, user.password);
    logger.information("password", isPasswordValid);
    if (!isPasswordValid) {
        return done(null, false, {message: "Password is not valid"});
    }
    const userId = user.id;
    logger.information("userId", userId);

    const {first_name, last_name, role} = user; 
    const token = generateToken({first_name, last_name, email, role});
    
    res
        .status(200)
        .cookie("token", token, {maxAge:60000, httpOnly: true})
        .redirect("/products");
} catch (error) {
    done(error);;
}
};

export const createB = async (req, res) => {
        const {name} = req.body;
        logger.information("Role de usuario: ", req.user.role);
        if (req.user.role === "user"){
            return res.status(403).json({message: "Hi! you have an user role"});
        }
        if (req.user.role === "admin"){
            return res.status(403).json({message: "Hi! you have an admin role"});
        }
        if (req.user.role === "premium"){
            return res.status(403).json({message: "Hi! you have a premium role"});
        }
        if (!name){
            return res.status(400).json({message: "Name is missing"});
        }
    };

// SIGNUP - LOGIN - PASSPORT GITHUB
    
export const createC = async (req, res) => {
        "/auth/github",
        passport.authenticate("github", { scope: ["user:email"] })
};
    
export const createD = async (req, res) => {
        res.redirect("/products");
};

// SIGNUP - LOGIN - PASSPORT GOOGLE

export const createE = async (req, res) => {
        '/auth/google',
        passport.authenticate('google', { scope:[ 'email', 'profile' ] })};

export const createF = async (req, res) => {
        '/auth/google/callback',
        passport.authenticate( 'google', { failureRedirect: '/error'}),
        (req, res)=>{
            res.redirect("/products");
        }
    };

export const createG = async (req, res) => {
    req.session.destroy(()=>{
        res.redirect("/login");
    });
};

export const createH = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await findByEmail(email);
        if (!user) {
            return res.redirect("/");
        }
        const hashedPassword = await hashData(password);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({message: "Password updated"});
        res.status();
    }catch(error){
        //res.status(500).json({error});
        CustomError.generateError(
            ErrorMessages.CAN_NOT_CREATE_SESSION,
            500,
            ErrorMessages.CAN_NOT_CREATE_SESSION
        );
    }
};





