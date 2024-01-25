
import {productsModel} from "./models/products.model.js";
import {logger} from "../../../logger.js";

class ProductsDao {

    async findAggregation(obj) {
        const { limit = 10, page = 1, sortBy = 'price', sortOrder = 'asc', ...filter } = obj;
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        const sortOptions = {
            [sortBy]: sortDirection
        };
        
        try {
        const response = await productsModel.paginate(filter, { limit, page, sort: sortOptions });
        const info = {
            status: "success", 
            payload: response.totalDocs,
            totalPages: response.totalPages,
            prevPage: response.prevPage ? response.prevPage : null,
            nextPage: response.nextPage ? response.nextPage : null,
            page: response.page,
            hasPrevPage: response.hasPrevPage ? response.hasPrevPage : null,
            hasNextPage: response.hasNextPage ? response.hasNextPage : null,
            prevLink: response.hasPrevPage ? `http://localhost:8080/api/products?page=${response.prevPage}` : null,
            nextLink: response.hasNextPage ? `http://localhost:8080/api/products?page=${response.nextPage}` : null,
        };
        logger.information(info);
        const result = response.docs.map(doc => ({ product: doc.toObject() }));
        return result;
        } catch (error) {
        const info = {
            status: "error",
            message: "Ha ocurrido un error en la búsqueda de productos.",
        };
            logger.error(error);
            return { result: [] };
        }
    }

    async findAll(){
        const result = await productsModel.find().lean();
        return result;
    }
    async findById(id){
        const result = await productsModel.findById(id);
        return result;
    }
    async createOne(obj){
        const result = await productsModel.create(obj);
        return result;
    }
    async updateOne(id, obj){
        const result = await productsModel.updateOne({_id: id}, obj);
        return result;
    }
    async deleteOne(id){
        const result = await productsModel.deleteOne({_id: id});
        return result;
    }
}

export const productsDao = new ProductsDao();


    /*
    async findAggregation(){
        
        const result = await productsModel.aggregate([
            {$match :{
                $and: [
                    {stock: {$gt: 0}}, 
                    {stock:{$lt:9}},
                    {statues: true }
                ],
                },
            },
            
            {
                $group:{
                    _id: "$category",
                },
            },
            
            {$sort: { price: -1}},
        ]);
        return result;
    }
    */