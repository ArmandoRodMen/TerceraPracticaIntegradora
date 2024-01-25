import { messagesDao } from "../DAL/DAO/mongodb/messages.dao.js";

export const findAll = async () => {
    try {
        const messages = await messagesDao.findAll();
        return messages; 
    } catch (error) {
        throw new Error("Error finding messages");
    }
};

export const createOne = async (messageData) => {
    authMiddleware(['user'])(req, res, async () => {
        const { username, message } = messageData; 
        if (!message) {
            throw new Error("Required data is missing");
        }
        try {
            const newMessage = await messagesDao.createOne(messageData);
            return newMessage; 
        } catch (error) {
            throw new Error("Error creating messages");
        }
    });
};
