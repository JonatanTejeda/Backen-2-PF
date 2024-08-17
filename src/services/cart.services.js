import ProductDaoMongoDB from "../daos/mongodb/product.dao.js";
import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";
import { CartModel } from "../daos/mongodb/models/cart.model.js";
import { createTicket } from '../daos/mongodb/ticket.dao.js';
import { v4 as uuidv4 } from 'uuid';


const productDao = new ProductDaoMongoDB();
const cartDao = new CartDaoMongoDB();


const handleError = (error) => {
    console.error(error);
    return null;
};

export const getAll = async () => {
    try {
        return await cartDao.getAll();
    } catch (error) {
        return handleError(error);
    }
};

export const getById = async (id) => {
    try {
        return await cartDao.getById(id);
    } catch (error) {
        return handleError(error);
    }
};

export const create = async () => {
    try {
        const newCart = await cartDao.create();
        return newCart || false;
    } catch (error) {
        return handleError(error);
    }
};

export const update = async (id, obj) => {
    try {
        return await cartDao.update(id, obj);
    } catch (error) {
        return handleError(error);
    }
};

export const remove = async (id) => {
    try {
        const cartDeleted = await cartDao.delete(id);
        return cartDeleted || false;
    } catch (error) {
        return handleError(error);
    }
};

export const addProdToCart = async (cartId, prodId) => {
    try {
        const existCart = await getById(cartId);
        if (!existCart) return null;

        const existProd = await productDao.getById(prodId);
        if (!existProd) return null;

        return await cartDao.addProdToCart(cartId, prodId);
    } catch (error) {
        return handleError(error);
    }
};

export const removeProdToCart = async (cartId, prodId) => {
    try {
        const existCart = await getById(cartId);
        if (!existCart) return null;

        const existProdInCart = await cartDao.existProdInCart(cartId, prodId);
        if (!existProdInCart) return null;

        return await cartDao.removeProdToCart(cartId, prodId);
    } catch (error) {
        return handleError(error);
    }
};

export const updateProdQuantityToCart = async (cartId, prodId, quantity) => {
    try {
        const existCart = await getById(cartId);
        if (!existCart) return null;

        const existProdInCart = await cartDao.existProdInCart(cartId, prodId);
        if (!existProdInCart) return null;
        
        return await cartDao.updateProdQuantityToCart(cartId, prodId, quantity);
    } catch (error) {
        return handleError(error);
    }
};

export const clearCart = async (cartId) => {
    try {
        const existCart = await getById(cartId);
        if (!existCart) return null;

        return await cartDao.clearCart(cartId);
    } catch (error) {
        return handleError(error);
    }
};

export const finalizarCompra = async (cartId, user) => {
    try {
        if (!user || !user._id) {
            throw new Error('Usuario no válido o no autenticado');
        }

        const cart = await CartModel.findById(cartId).populate("products.product");
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        let totalAmount = 0;

        for (let item of cart.products) {
            const { product, quantity } = item;

            if (!product || !product._id) {
                throw new Error(`Producto no encontrado en el carrito`);
            }

            if (product.stock == null || isNaN(product.stock)) {
                throw new Error(`El producto ${product.name || 'desconocido'} tiene un valor de stock inválido`);
            }

            if (product.stock < quantity) {
                throw new Error(`El producto ${product.name} insuficiente stock`);
            }

          
            const newStock = product.stock - quantity;
            await productDao.update(product._id, { stock: newStock });

            totalAmount += quantity * product.price;
        }

        
        const ticket = await createTicket({
            code: uuidv4(),
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: user._id,
        });

        return ticket;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
