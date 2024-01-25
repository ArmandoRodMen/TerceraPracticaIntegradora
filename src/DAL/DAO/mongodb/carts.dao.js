import { cartsModel } from "./models/carts.model.js"

class CartsDao{
    async createCart(){
        const newCart = { products:[]};
        const response = await cartsModel.create(newCart);
        return response;
    }

    async findCartById(idCart){
        const response = await cartsModel.findById(idCart).populate("products.product");
        return response;
    }
    async addProductToCart(idCart, idProduct){
        const cart = await cartsModel.findById(idCart);
        const productIndex = cart.products.findIndex(
            (p)=>p.product.equals(idProduct)
        );

        if(productIndex===-1){
            cart.products.push({product: idProduct, quantity:1});
        }else{
            cart.products[productIndex].quantity++;
        }
        return cart.save();
    }

    async findProductsInCart(idCart){
      const cart = await cartsModel.findCartById(idCart);
      if (!cart) {
        throw new Error("Cart not found");
      }
      const productsInCart = cart.products.map(doc => doc.toObject());
      return productsInCart;
    }

    async updateProductInCart(idCart, idProduct, quantity) {
      const cart = await cartsModel.findCartById(idCart);
      if (!cart) {
        throw new Error("Cart not found");
      }
      const productIndex = cart.products.findIndex(
        (p) => p.product.equals(idProduct)
      );
      if (productIndex === -1) {
        throw new Error("Product not found in the cart");
      }
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return cart;
    }

    async deleteProductInCart(idCart, idProduct){
      const cart = await cartsModel.findById(idCart);
      if (!cart) {
        throw new Error("Cart not found");
      }      
      const productIndex = cart.products.findIndex(
        (p) => p.product.equals(idProduct)
      );
      if (productIndex === -1) {
        throw new Error("Product not found in the cart");
      }
      cart.products.splice(productIndex, 1);
      return cart.save();
    }

    async deleteProductsInCart(idCart){
      const cart = await cartsModel.findById(idCart);
      if (!cart) {
        throw new Error("Cart not found");
      }
      cart.products = [];
      await cart.save();
    }

    async updateAllProducts(idCart, products){
      const cart = await cartsModel.findById(idCart);
      const newProducts = products;
      cart.products = newProducts;
      await cart.save();
      return cart
    }

    async getCarts() {
        const carts = await cartsModel.find();
        return carts;
    }

    async deleteCart(id){
      const result = await cartsModel.deleteOne({_id: id});
      return result;
  }
}

export const cartsDao  = new CartsDao();
