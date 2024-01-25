import { usersManager } from "../DAO/mongodb/managers/usersManager.js";
import { hashData, compareData, generateToken } from "../utils.js";
import passport from "passport";

export const createSession = async (req, res) => {
    const { first_name, last_name, email, password, username } = req.body;
    
    if (!first_name || !last_name || !email || !password || !username) {
        return res.status(400).json({ message: "Some data is missing" });
    }

    try {
        const hashedPassword = await hashData(password);
        const existingUser = await usersManager.findByEmail(email);
        const redirectUrl = `/login`;

        if (existingUser) {
            return res.redirect(redirectUrl);
        }

        const createdUser = await usersManager.createOne({ ...req.body, password: hashedPassword });
        const userId = createdUser.id; 
        
        res.redirect(redirectUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

export const findByEmail = async (req, res, done) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return done(null, false, { message: "Some data is missing" });
    }

    try {
        const user = await usersManager.findByEmail(email);

        if (!user) {
            return done(null, false, { message: "Username is not valid" });
        }

        const isPasswordValid = await compareData(password, user.password);

        if (!isPasswordValid) {
            return done(null, false, { message: "Password is not valid" });
        }

        const userId = user.id;
        const { first_name, last_name, role } = user; 
        const token = generateToken({ first_name, last_name, email, role });

        res
            .status(200)
            .cookie("token", token, { maxAge: 60000, httpOnly: true })
            .redirect("/products");
    } catch (error) {
        console.error(error);
        done(error);
    }
};

export const getUserStatus = async (req, res) => {
    const { name } = req.body;
    console.log("Role de usuario: ", req.user.role);

    if (req.user.role === "user"){
        return res.status(403).json({ message: "Hi! you have a user role" });
    }

    if (req.user.role === "admin"){
        return res.status(403).json({ message: "Hi! you have an admin role" });
    }

    if (req.user.role === "premium"){
        return res.status(403).json({ message: "Hi! you have a premium role" });
    }

    if (!name){
        return res.status(400).json({ message: "Name is missing" });
    }
};

export const authenticateGitHub = async (req, res) => {
    passport.authenticate("github", { scope: ["user:email"] });
};

export const callBackGitHub = async (req, res) => {
    passport.authenticate("github", (req, res) => {
        res.redirect("/products");
    });
};

export const authenticateGoogle = async (req, res) => {
    passport.authenticate('google', { scope: [ 'email', 'profile' ] });
};

export const callBackGoogle = async (req, res) => {
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    (req, res) => {
        res.redirect("/products");
    };
};

export const sigOut = async (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};

export const restore = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await usersManager.findByEmail(email);

        if (!user) {
            return res.redirect("/");
        }

        const hashedPassword = await hashData(password);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};
