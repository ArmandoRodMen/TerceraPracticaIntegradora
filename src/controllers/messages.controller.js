import passport from 'passport';
import {
    findAll,
    createOne
} from "../services/messages.services.js";
import CustomError from "../errors/error.generator.js";
import { ErrorMessages } from "../errors/errors.enum.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { logger } from '../logger.js';

export const findMessages = async (req, res) => {
    try {
        const messages = await findAll(res);
        res.render('chat', { messages });
    } catch (error) {
        //res.status(500).json({ error: error.message });
        CustomError.generateError(
            ErrorMessages.CAN_NOT_FIND_MESSAGES,
            500,
            ErrorMessages.CAN_NOT_FIND_MESSAGES
        );
    }
};

export const createMessage = async (req, res) => {
    passport.authenticate('jwt', { session: false })(req, res, async () =>{
        authMiddleware(['user'])(req, res, async () => {
            const { username, message} = req.body;
            logger.information("/////////\n",username,message);
            if (!message) {
                //res.status(400).json({ message: "Required data is missing" });
                CustomError.generateError(
                    ErrorMessages.BAD_DATA,
                    400,
                    ErrorMessages.BAD_DATA
                );
            }
        });
        /*
        try {
            const newMessage = await createOne(req);
            const messages = await findAll(res);

            //res.render('chat', { messages, username });
        } catch (error) {
            CustomError.generateError(
                ErrorMessages.CAN_NOT_CREATE_MESSAGE,
                500,
                ErrorMessages.CAN_NOT_CREATE_MESSAGE
            );
        }*/
    });
};
