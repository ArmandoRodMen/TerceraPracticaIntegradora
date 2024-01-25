import { usersModel } from "./models/users.model.js";
import { hashData, compareData } from "../../../utils.js";

class UsersDao{
    async findAll(){
        const response = await usersModel.find();
        return response;
    }

    async findById(id){
        const response = await usersModel.findById(id);
        return response;
    }

    async findByEmail(email){
        const response = await usersModel.findOne({email});
        return response;
    }

    async createOne(obj){
        const response = await usersModel.create(obj);
        return response;
    }

    async updateOne(id, obj){
        const response = await usersModel.updateOne({_id:id}, obj);
        return response;
    }

    async deleteOne(id){
        const response = await usersModel.deleteOne({_id:id});
        return response;
    }

    async updatePasswordResetToken(email, token, expirationTime) {
        const response = await usersModel.findOneAndUpdate(
            { email },
            { $set: { resetToken: token, resetTokenExpiration: expirationTime } },
            { new: true }
        );
        return response;
    }

    async findByResetToken(token) {
        const response = await usersModel.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });
    
        return response;
    }

    async resetPassword(token, newPassword) {
        const user = await usersModel.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });
    
        if (user) {
            const isDifferentPassword = await compareData(newPassword, user.password);
    
            if (!isDifferentPassword) {
                return { success: false, message: "La nueva contraseña no puede ser igual a la contraseña anterior." };
            }
            const hashedPassword = await hashData(newPassword);
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            await user.save();
            return { success: true };
        }
    
        return { success: false, message: "Token no válido o expirado." };
    }
}

export const usersDao = new UsersDao();