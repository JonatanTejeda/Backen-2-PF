import * as service from '../services/cart.services.js';
import * as cartService from '../services/cart.services.js';

export const getAll = async (req, res, next) => {
  try {
    const response = await service.getAll();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await service.getById(id);
    if (!response) {
      res.status(404).json({ msg: "Carrito no encontrado" });
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const newCart = await service.create();
    if (!newCart) {
      res.status(500).json({ msg: "Error al crear el carrito" });
    } else {
      res.status(201).json(newCart);
    }
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cartUpd = await service.update(id, req.body);
    if (!cartUpd) {
      res.status(404).json({ msg: "Error al actualizar el carrito" });
    } else {
      res.status(200).json(cartUpd);
    }
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cartDel = await service.remove(id);
    if (!cartDel) {
      res.status(404).json({ msg: "Error al eliminar el carrito" });
    } else {
      res.status(200).json({ msg: `Carrito id: ${id} eliminado` });
    }
  } catch (error) {
    next(error);
  }
};

export const addProdToCart = async (req, res, next) => {
  try {
    const { idCart, idProd } = req.params;
    const newProdToUserCart = await service.addProdToCart(idCart, idProd);
    if (!newProdToUserCart) {
      res.status(500).json({ msg: "Error al agregar producto al carrito" });
    } else {
      res.status(200).json(newProdToUserCart);
    }
  } catch (error) {
    next(error);
  }
};

export const removeProdToCart = async (req, res, next) => {
  try {
    const { idCart, idProd } = req.params;
    const delProdToUserCart = await service.removeProdToCart(idCart, idProd);
    if (!delProdToUserCart) {
      res.status(500).json({ msg: "Error al eliminar producto del carrito" });
    } else {
      res.status(200).json({ msg: `Producto ${idProd} eliminado del carrito` });
    }
  } catch (error) {
    next(error);
  }
};

export const updateProdQuantityToCart = async (req, res, next) => {
  try {
    const { idCart, idProd } = req.params;
    const { quantity } = req.body;
    const updateProdQuantity = await service.updateProdQuantityToCart(idCart, idProd, quantity);
    if (!updateProdQuantity) {
      res.status(500).json({ msg: "Error al actualizar la cantidad del producto en el carrito" });
    } else {
      res.status(200).json(updateProdQuantity);
    }
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const { idCart } = req.params;
    const clearCart = await service.clearCart(idCart);
    if (!clearCart) {
      res.status(500).json({ msg: "Error al vaciar el carrito" });
    } else {
      res.status(200).json(clearCart);
    }
  } catch (error) {
    next(error);
  }
};

export const finalizarCompra = async (req, res, next) => {
  try {
    const user = req.user; 
    const result = await cartService.finalizarCompra(req.params.id, user); 
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al finalizar la compra:", error);

    if (error.message.includes('no tiene stock suficiente')) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Ocurrió un error al finalizar la compra" });
  }
};
