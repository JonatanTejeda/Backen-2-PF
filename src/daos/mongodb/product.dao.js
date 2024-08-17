import { ProductModel } from "../mongodb/models/product.model.js";

export default class ProductDaoMongoDB {
  async getAll(page = 1, limit = 10, name, sort) {
    try {
      const filter = name ? { 'name': new RegExp(name, 'i') } : {}; 
      let sortOrder = {};
      
      if (sort) {
        sortOrder.price = sort === 'asc' ? 1 : sort === 'desc' ? -1 : 0;
      }

      const response = await ProductModel.paginate(filter, { page, limit, sort: sortOrder });
      return response;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw new Error('Error al obtener productos');
    }
  }

  async getById(id) {
    try {
      const response = await ProductModel.findById(id);
      if (!response) {
        throw new Error('Producto no encontrado');
      }
      return response;
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error);
      throw new Error('Error al obtener el producto por ID');
    }
  }

  async create(obj) {
    try {
      const response = await ProductModel.create(obj);
      return response;
    } catch (error) {
      console.error('Error al crear el producto:', error);
      throw new Error('Error al crear el producto');
    }
  }

  async update(id, obj) {
    try {
      const response = await ProductModel.findByIdAndUpdate(id, obj, { new: true });
      if (!response) {
        throw new Error('Producto no encontrado para actualizar');
      }
      return response;
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw new Error('Error al actualizar el producto');
    }
  }

  async delete(id) {
    try {
      const response = await ProductModel.findByIdAndDelete(id);
      if (!response) {
        throw new Error('Producto no encontrado para eliminar');
      }
      return response;
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw new Error('Error al eliminar el producto');
    }
  }
}
