import passport from 'passport';
import {
    findAll,
    findById,
    findByEmail,
    createOne,
    updateOne,
    deleteOne
} from "../services/users.services.js";
import CustomError from "../errors/error.generator.js";
import { ErrorMessages } from "../errors/errors.enum.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { logger } from '../logger.js';

export const findUsers = async (req, res) => {
    try {
        const users = await findAll();
        res.status(200).json({ message: "Users", users });
    } catch (error) {
        //res.status(500).json({ error: error.message });
        CustomError.generateError(
            ErrorMessages.USERS_NOT_FOUND,
            500,
            ErrorMessages.USERS_NOT_FOUND
        );
    }
};

export const findUser = async (req, res) => {
        const { idUser } = req.params;
        try {
            const user = await findById(idUser);
            const role = user.role;
            res.status(200).json({ message: "User", user });
        } catch (error) {
            //res.status(500).json({ error: error.message });
            CustomError.generateError(
                ErrorMessages.USER_NOT_FOUND,
                500,
                ErrorMessages.USER_NOT_FOUND
            );
            logger.information("Entro");
        }
};


export const deleteUser = async (req, res) => {
    const { idUser } = req.params;
    const role = user.role;
    if(role === "admin"){
        try {
            await deleteOne(idUser);
            res.status(200).json({ message: "User deleted:" });
        } catch (error) {
            //res.status(500).json({ error: error.message });
            CustomError.generateError(
                ErrorMessages.USER_NOT_DELETED,
                500,
                ErrorMessages.USER_NOT_DELETED
            );
        }
    };
};


export const createUser = async (req, res) => {
    const { first_name, last_name, email, password, username } = req.body;
    if (!first_name || !last_name || !email || !password || !username) {
        return res.status(400).json({ message: "Some data is missing" });
    }
    try {
        const createdUser = await createOne(req.body);
        res.redirect(`/profile/${createdUser._id}`);
    } catch (error) {
        //res.status(500).json({ error: error.message });
        CustomError.generateError(
            ErrorMessages.USER_NOT_CREATED,
            500,
            ErrorMessages.USER_NOT_CREATED
        );
    }
};

export const updateUser = async (req, res) => {
    const { idUser } = req.params;
    const updateData = req.body;

    try {
        const updatedUser = await updateOne(idUser, updateData);
        res.status(200).json({ message: "User updated", user: updatedUser });
    } catch (error) {
        //res.status(500).json({ error: error.message });
        CustomError.generateError(
            ErrorMessages.USER_NOT_UPDATED,
            500,
            ErrorMessages.USER_NOT_UPDATED
        );
    }
};

export const findUserByEmail = async (req, res) => {

            const { email } = req.params;
            try {
                const user = await findByEmail(email);
                res.status(200).json({ message: "User found by email", user });
            } catch (error) {
                //res.status(500).json({ error: error.message });
                CustomError.generateError(
                    ErrorMessages.USER_NOT_FOUND_BY_EMAIL,
                    500,
                    ErrorMessages.USER_NOT_FOUND_BY_EMAIL
                );
            };

};

export const changeRole = async (req, res) => {

            const { idUser } = req.params;

            try {
                const user = await findById(idUser);

                // Check the current role and toggle it
                user.role = user.role === 'user' ? 'premium' : 'user';
                
                // Save the updated user to the database
                const updatedUser = await user.save();

                res.status(200).json({ message: "User role updated", user: updatedUser });
            } catch (error) {
                CustomError.generateError(
                    ErrorMessages.USER_ROLE_NOT_UPDATED,
                    500,
                    ErrorMessages.USER_ROLE_NOT_UPDATED
                );
            }

};

/*export const findUserByEmail = async (req, res) => {
    passport.authenticate('jwt', { session: false })(req, res, async () =>{
        authMiddleware(['admin'])(req, res, async () => {
            const { email } = req.params;
            try {
                const user = await findByEmail(email);
                res.status(200).json({ message: "User found by email", user });
            } catch (error) {
                //res.status(500).json({ error: error.message });
                CustomError.generateError(
                    ErrorMessages.USER_NOT_FOUND_BY_EMAIL,
                    500,
                    ErrorMessages.USER_NOT_FOUND_BY_EMAIL
                );
            };
        });
    });
}; */