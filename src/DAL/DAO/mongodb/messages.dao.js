import {messagesModel} from "./models/messages.model.js";

class MessagesDao{
    async findAll(){
        const result = await messagesModel.find().lean();
        return result;
    }
    async createOne(obj){
        const result = await messagesModel.create(obj);
        return result;
    }
}

export const messagesDao = new MessagesDao();