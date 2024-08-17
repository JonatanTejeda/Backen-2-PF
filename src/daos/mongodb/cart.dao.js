import { CartModel } from "./models/cart.model.js";

export default class CartDaoMongoDB {
  async create() {
    try {
      return await CartModel.create({
        products: [],
      });
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      throw new Error('Error al crear el carrito');
    }
  }

  async getAll() {
    try {
      return await CartModel.find({});
    } catch (error) {
      console.error('Error al obtener todos los carritos:', error);
      throw new Error('Error al obtener todos los carritos');
    }
  }

  async getById(id) {
    try {
      return await CartModel.findById(id).populate("products.product");
    } catch (error) {
      console.error('Error al obtener el carrito por ID:', error);
      throw new Error('Error al obtener el carrito por ID');
    }
  }

  async delete(id) {
    try {
      return await CartModel.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error al eliminar el carrito:', error);
      throw new Error('Error al eliminar el carrito');
    }
  }

  async existProdInCart(cartId, prodId) {
    try {
      return await CartModel.findOne({
        _id: cartId,
        products: { $elemMatch: { product: prodId } }
      });
    } catch (error) {
      console.error('Error al verificar existencia del producto en el carrito:', error);
      throw new Error('Error al verificar existencia del producto en el carrito');
    }
  }

  async addProdToCart(cartId, prodId) {
    try {
      const existProdInCart = await this.existProdInCart(cartId, prodId);

      if (existProdInCart) {
        return await CartModel.findOneAndUpdate(
          { _id: cartId, 'products.product': prodId },
          { $inc: { 'products.$.quantity': 1 } },  
          { new: true }
        );
      } else {
        return await CartModel.findByIdAndUpdate(
          cartId,
          { $push: { products: { product: prodId, quantity: 1 } } },
          { new: true }
        );
      }
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
      throw new Error('Error al agregar el producto al carrito');
    }
  }

  async removeProdToCart(cartId, prodId) {
    try {
      return await CartModel.findByIdAndUpdate(
        cartId,
        { $pull: { products: { product: prodId } } },
        { new: true }
      );
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
      throw new Error('Error al eliminar el producto del carrito');
    }
  }

  async update(id, obj) {
    try {
      return await CartModel.findByIdAndUpdate(id, obj, {
        new: true,
      });
    } catch (error) {
      console.error('Error al actualizar el carrito:', error);
      throw new Error('Error al actualizar el carrito');
    }
  }

  async updateProdQuantityToCart(cartId, prodId, quantity) {
    try {
      return await CartModel.findOneAndUpdate(
        { _id: cartId, 'products.product': prodId },
        { $set: { 'products.$.quantity': quantity } },
        { new: true }
      );
    } catch (error) {
      console.error('Error al actualizar la cantidad del producto en el carrito:', error);
      throw new Error('Error al actualizar la cantidad del producto en el carrito');
    }
  }

  async clearCart(cartId) {
    try {
      return await CartModel.findByIdAndUpdate(
        cartId,
        { $set: { products: [] } },
        { new: true }
      );
    } catch (error) {
      console.error('Error al limpiar el carrito:', error);
      throw new Error('Error al limpiar el carrito');
    }
  }
}
