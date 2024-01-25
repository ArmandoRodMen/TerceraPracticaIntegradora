import { usersDao } from "../DAL/DAO/mongodb/users.dao.js";
import { hashData } from "../utils.js";

export const findAll = async () => {
    const users = await usersDao.findAll();
    return users;
};

export const findById = async (id) => {
    const user = await usersDao.findById(id);
    return user;
};

export const findByEmail = async (email) => {
    const user = await usersDao.findByEmail(email);
    return user;
};

export const createOne = async (obj) => {
    const hashedPassword = hashData(obj.password);
    const newObj = { ...obj, password: hashedPassword, cart: createdCart._id, role: 'user'};
    const createdUser = await usersDao.createOne(newObj);
    return createdUser;
};

export const updateOne = async (id, obj) => {
    const response = await usersDao.updateOne(id, obj);
    return response;
};

export const deleteOne = async (id) => {
    const response = await usersDao.deleteOne(id);
    return response;
};
