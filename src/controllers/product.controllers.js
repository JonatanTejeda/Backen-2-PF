import * as service from "../services/product.services.js";

export const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, query, sort } = req.query;
    const response = await service.getAll(page, limit, query, sort);

    const nextLink = response.hasNextPage
      ? `http://localhost:8080/products?page=${response.nextPage}&limit=${limit}&sort=${sort}&query=${query}`
      : null;

    const prevLink = response.hasPrevPage
      ? `http://localhost:8080/products?page=${response.prevPage}&limit=${limit}&sort=${sort}&query=${query}`
      : null;

    res.status(200).json({
      status: 'success',
      payload: response.docs,
      totalPages: response.totalPages,
      prevPage: response.prevPage,
      nextPage: response.nextPage,
      page: response.page,
      hasNextPage: response.hasNextPage,
      hasPrevPage: response.hasPrevPage,
      prevLink,
      nextLink
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await service.getById(id);
    if (!response) {
      res.status(404).json({ msg: "Producto no encontrado" });
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const newProd = await service.create(req.body);
    if (!newProd) {
      res.status(500).json({ msg: "Error al crear el producto" });
    } else {
      res.status(201).json(newProd);
    }
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prodUpd = await service.update(id, req.body);
    if (!prodUpd) {
      res.status(404).json({ msg: "Error al actualizar el producto" });
    } else {
      res.status(200).json(prodUpd);
    }
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prodDel = await service.remove(id);
    if (!prodDel) {
      res.status(404).json({ msg: "Error al eliminar el producto" });
    } else {
      res.status(200).json({ msg: `Producto id: ${id} eliminado` });
    }
  } catch (error) {
    next(error);
  }
};
