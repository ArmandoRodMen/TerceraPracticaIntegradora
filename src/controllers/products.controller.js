import passport from 'passport';
import {
    findAggregation,
    findById,
    createOne,
    deleteOne,
    updateOne
} from "../services/products.services.js";
import CustomError from "../errors/error.generator.js";
import { ErrorMessages } from "../errors/errors.enum.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';

    export const findProductAggregation = async (req, res) => {
        try {
            const products = await findAggregation(req.query);
            res.status(200).json({ message: "Products found", products });
        } catch (error) {
            //res.status(500).json({ message: error.message });
            CustomError.generateError(
                ErrorMessages.CAN_NOT_FIND_AGGREGATION,
                500,
                ErrorMessages.CAN_NOT_FIND_AGGREGATION
            );
        }
    };
    
    export const findProductById = async (req, res) => {
        const { idProduct } = req.params;
        try {
            const product = await findById(idProduct);
            if (!product) {
                return res.status(404).json({ message: "No product found with that id" });
            }
            res.status(200).json({ message: "Product found", product });
        } catch (error) {
            //res.status(500).json({ message: error.message });
            CustomError.generateError(
                ErrorMessages.CAN_NOT_FIND_PRODUCT_BY_ID,
                500,
                ErrorMessages.CAN_NOT_FIND_PRODUCT_BY_ID
            );
        }
    };
    
    export const createProduct = async (req, res) => {
        passport.authenticate('jwt', { session: false })(req, res, async () => {
            authMiddleware(['admin', 'premium'])(req, res, async () => {
                const { title, description, code, price, stock } = req.body;
    
                if (!title || !description || !code || !price) {
                    return res.status(400).json({ message: "Required data is missing" });
                }
    
                try {
                    const userId = req.user._id;  // Obtén el _id del usuario desde el token JWT
    
                    // Verifica si el usuario tiene el rol "premium"
                    const user = await usersModel.findById(userId);
                    if (user && user.role === 'premium') {
                        // Crea el producto y establece el "owner" como el _id del usuario
                        const newProduct = await createOne({ ...req.body, owner: userId });
    
                        res.status(201).json({ message: "Product created", product: newProduct });
                    } else {
                        res.status(403).json({ error: "El usuario no tiene permisos para crear productos premium." });
                    }
                } catch (error) {
                    // Maneja el error adecuadamente
                    console.error(error);
                    res.status(500).json({ error: "Error al crear el producto." });
                }
            });
        });
    };
    
    export const deleteProduct = async (req, res) => {
        passport.authenticate('jwt', { session: false })(req, res, async () => {
            authMiddleware(['admin', 'premium'])(req, res, async () => {
                const { idProduct } = req.params;
                const userId = req.user._id;  // Obtén el _id del usuario desde el token JWT
    
                try {
                    if (!idProduct) {
                        return res.status(404).json({ message: "No product found with that id" });
                    }
    
                    // Verifica si el producto existe
                    const product = await productsModel.findById(idProduct);
                    if (!product) {
                        return res.status(404).json({ message: "No product found with that id" });
                    }
    
                    // Verifica si el usuario tiene permisos para eliminar el producto
                    if (req.user.role === 'admin' || (req.user.role === 'premium' && product.owner.toString() === userId.toString())) {
                        await deleteOne(idProduct);
                        res.status(200).json({ message: "Product deleted" });
                    } else {
                        res.status(403).json({ error: "El usuario no tiene permisos para eliminar este producto." });
                    }
                } catch (error) {
                    // Maneja el error adecuadamente
                    console.error(error);
                    res.status(500).json({ error: "Error al eliminar el producto." });
                }
            });
        });
    };
    

    export const updateProductById = async (req, res) => {
        passport.authenticate('jwt', { session: false })(req, res, async () => {
            authMiddleware(['admin', 'premium'])(req, res, async () => {
                const { idProduct } = req.params;
                const userId = req.user._id;  // Obtén el _id del usuario desde el token JWT
                try {
                    if (!idProduct) {
                        return res.status(404).json({ message: "No product found with that id" });
                    }
                    // Verifica si el producto existe
                    const product = await productsModel.findById(idProduct);
                    if (!product) {
                        return res.status(404).json({ message: "No product found with that id" });
                    }
                    // Verifica si el usuario tiene permisos para actualizar el producto
                    if (req.user.role === 'admin' || (req.user.role === 'premium' && product.owner.toString() === userId.toString())) {
                        await updateOne(idProduct, req.body); // Puedes pasar los nuevos datos a la función de actualización
                        res.status(200).json({ message: "Product updated" });
                    } else {
                        res.status(403).json({ error: "El usuario no tiene permisos para actualizar este producto." });
                    }
                } catch (error) {
                    // Maneja el error adecuadamente
                    console.error(error);
                    res.status(500).json({ error: "Error al actualizar el producto." });
                }
            });
        });
    };