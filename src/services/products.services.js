import { productsDao } from "../DAL/DAO/mongodb/products.dao.js";

    export const findAggregation = async (query) => {
        try {
            const products = await productsDao.findAggregation(query);
            return products;
        } catch (error) {
            throw new Error("Product not found");
        }
    };

    export const findById = async (idProduct) => {
        try {
            const product = await productsDao.findById(idProduct);
            if (!product) {
            throw new Error("No product found with that id");
            }
            return product;
        } catch (error) {
            throw new Error("Product with ID not found");
        }
    };

    export const createOne = async (data) => {
        const { title, description, code, price, stock } = data;
        if (!title || !description || !code || !price) {
            throw new Error("Required data is missing");
        }
        try {
            const newProduct = await productsDao.createOne(data);
            return newProduct;
        } catch (error) {
            throw new Error("Error creating product");
        }
    };

    export const deleteOne = async (idProduct) => {
        try {
            if (!idProduct) {
            throw new Error("No product found with that id");
            }
            await productsDao.deleteOne(idProduct);
        } catch (error) {
            throw new Error("Error deleting product");
        }
    };

    export const updateOne = async (idProduct) =>{
        try {
            if (!idProduct) {
            throw new Error("No product found with that id");
            }
            await productsDao.updateOne(idProduct);
        } catch (error) {
            throw new Error("Error updating product");
        }
    }
