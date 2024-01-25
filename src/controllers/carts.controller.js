import passport from 'passport';
import { 
    createCart, 
    findCartById, 
    addProductToCart, 
    findProductsInCart, 
    updateProductInCart, 
    deleteProductInCart, 
    deleteProductsInCart, 
    updateAllProducts, 
    getCarts, 
    deleteCart, 
    purchase
} from "../services/carts.services.js";
import CustomError from "../errors/error.generator.js";
import { ErrorMessages } from "../errors/errors.enum.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const createNewCart = async (req, res) => {
    try {
        const newCart = await createCart();
        res.status(200).json({ message: "Cart created", cart: newCart });
    } catch (error) {
        //res.status(500).json({ message: "Error creating cart", error: error.message });
        CustomError.generateError(
            ErrorMessages.CART_NOT_CREATED,
            500,
            ErrorMessages.CART_NOT_CREATED
        );
    }
};

export const findCart = async (req, res) => {
    const { idCart } = req.params;
    try {
    const cart = await findCartById(idCart);
    res.status(200).json({ message: "Cart found", cart });
    } catch (error) {
    //res.status(404).json({ message: "Cart not found", error: error.message });
    CustomError.generateError(
        ErrorMessages.CART_NOT_FOUND,
        500,
        ErrorMessages.CART_NOT_FOUND
    );
    }
};

export const addProduct = async (req, res) => {
    passport.authenticate('jwt', { session: false })(req, res, async () => {
        authMiddleware(['user', 'premium'])(req, res, async () => {
            const { idCart, idProduct } = req.params;
            const userId = req.user._id;  // Obtén el _id del usuario desde el token JWT
            try {
                // Verifica si el usuario es "premium"
                if (req.user.role === 'premium') {
                    // Verifica si el producto pertenece al usuario antes de agregarlo al carrito
                    const product = await productsModel.findById(idProduct);
                    if (product && product.owner.toString() === userId.toString()) {
                        return res.status(403).json({ error: "Un usuario premium no puede agregar su propio producto al carrito." });
                    }
                }
                const updatedCart = await addProductToCart(idCart, idProduct);
                res.status(200).json({ message: "Product added to cart", cart: updatedCart });
            } catch (error) {
                // Maneja el error adecuadamente
                console.error(error);
                res.status(500).json({ error: "Error adding product to cart." });
            }
        });
    });
};

export const getProductsInCart = async (req, res) => {
    const { idCart } = req.params;
    try {
    const productsInCart = await findProductsInCart(idCart);
    res.status(200).json({ message: "Products in cart", products: productsInCart });
    } catch (error) {
    //res.status(500).json({ message: "Error retrieving products in cart", error: error.message });
    CustomError.generateError(
        ErrorMessages.CAN_NOT_GET_PRODUCTS_IN_CART,
        500,
        ErrorMessages.CAN_NOT_GET_PRODUCTS_IN_CART
    );
    }
};

export const getProductInCart = async (req, res) => {
    const { idCart, idProduct } = req.params;
    try {
    const productInCart = await addProductToCart(idCart);
    res.status(200).json({ message: "Product added to cart", cart: updatedCart });
    } catch (error) {
    //res.status(500).json({ message: "Error adding product to cart", error: error.message });
    CustomError.generateError(
        ErrorMessages.CAN_NOT_GET_PRODUCT_IN_CART,
        500,
        ErrorMessages.CAN_NOT_GET_PRODUCT_IN_CART
    );
    }
};

export const getTotal = async (req, res) =>{
    const {idCart} = req.params;
    try{
        const response = await purchase(idCart);
        res.status(200).json({ message: "Purchase done", purchase: response});
    }catch(error){
        //res.status(500).json({ message: "Error in purchase", error: error.message });
        CustomError.generateError(
            ErrorMessages.CAN_NOT_GET_TOTAL,
            500,
            ErrorMessages.CAN_NOT_GET_TOTAL
        );
    }
};

export const updateProductQuantity = async (req, res) => {
    const { idCart, idProduct } = req.params;
    const { quantity } = req.body;
    try {
        const updatedCart = await updateProductInCart(idCart, idProduct, quantity);
        res.status(200).json({ message: "Product quantity updated in cart", cart: updatedCart });
    } catch (error) {
        //res.status(500).json({ message: "Error updating product quantity in cart", error: error.message });
        CustomError.generateError(
            ErrorMessages.CAN_NOT_UPDATE_PRODUCT_QUANTITY,
            500,
            ErrorMessages.CAN_NOT_UPDATE_PRODUCT_QUANTITY
        );
    }
};

export const removeProductFromCart = async (req, res) => {
    passport.authenticate('jwt', { session: false })(req, res, async () =>{
        authMiddleware(['user'])(req, res, async () => {
            const { idCart, idProduct } = req.params;
            try {
                const updatedCart = await deleteProductInCart(idCart, idProduct);
                res.status(200).json({ message: "Product removed from cart", cart: updatedCart });
            } catch (error) {
                //res.status(500).json({ message: "Error removing product from cart", error: error.message });
                CustomError.generateError(
                    ErrorMessages.CAN_NOT_UPDATE_PRODUCT_QUANTITY,
                    500,
                    ErrorMessages.CAN_NOT_UPDATE_PRODUCT_QUANTITY
                );
            }
        });
    });
};

export const removeAllProductsFromCart = async (req, res) => {
    passport.authenticate('jwt', { session: false })(req, res, async () =>{
        authMiddleware(['user'])(req, res, async () => {
            const { idCart } = req.params;
            try {
                await deleteProductsInCart(idCart);
                res.status(200).json({ message: "All products removed from cart", cartId: idCart });
            } catch (error) {
                //res.status(500).json({ message: "Error removing all products from cart", error: error.message });
                CustomError.generateError(
                    ErrorMessages.REMOVE_ALL_PRODUCTS_FROM_CART,
                    500,
                    ErrorMessages.REMOVE_ALL_PRODUCTS_FROM_CART
                );
            };
        });
    });
};

export const updateAllProductsInCart = async (req, res) => {
    const { idCart } = req.params;
    const { products } = req.body;
    try {
        const updatedCart = await updateAllProducts(idCart, products);
        res.status(200).json({ message: "All products in cart updated", cart: updatedCart });
    } catch (error) {
        //res.status(500).json({ message: "Error updating all products in cart", error: error.message });
        CustomError.generateError(
            ErrorMessages.UPDATE_ALL_PRODUCTS_IN_CART,
            500,
            ErrorMessages.UPDATE_ALL_PRODUCTS_IN_CART
        );
    }
};

export const getAllCartsData = async (req, res) => {
    try {
        const carts = await getCarts();
        res.status(200).json({ message: "All carts retrieved", carts });
    } catch (error) {
        //res.status(500).json({ message: "Error retrieving all carts", error: error.message });
        CustomError.generateError(
            ErrorMessages.REMOVE_CART_BY_ID,
            500,
            ErrorMessages.REMOVE_CART_BY_ID
        );
    }
};

export const removeCartById = async (req, res) => {
    const { idCart } = req.params;
    try {
    const result = await deleteCart(idCart);
    res.status(200).json({ message: "Cart deleted", result });
    } catch (error) {
    //res.status(500).json({ message: "Error deleting cart", error: error.message });
    CustomError.generateError(
        ErrorMessages.REMOVE_CART_BY_ID,
        500,
        ErrorMessages.REMOVE_CART_BY_ID
    );
    }
};
