import ProductDaoMongoDB from "../daos/mongodb/product.dao.js";
const productDao = new ProductDaoMongoDB();

const handleError = (error) => {
  console.error(error);
  return false; 
};

export const getAll = async (page, limit, name, sort) => {
  try {
    return await productDao.getAll(page, limit, name, sort);
  } catch (error) {
    return handleError(error);
  }
};

export const getById = async (id) => {
  try {
    const product = await productDao.getById(id);
    return product || false;
  } catch (error) {
    return handleError(error);
  }
};

export const create = async (obj) => {
  try {
    const newProduct = await productDao.create(obj);
    return newProduct || false;
  } catch (error) {
    return handleError(error);
  }
};

export const update = async (id, obj) => {
  try {
    const updatedProduct = await productDao.update(id, obj);
    return updatedProduct || false;
  } catch (error) {
    return handleError(error);
  }
};

export const remove = async (id) => {
  try {
    const deletedProduct = await productDao.delete(id);
    return deletedProduct || false;
  } catch (error) {
    return handleError(error);
  }
};
