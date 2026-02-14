const { ProductosRepository } = require('../repositories/productos.repository');

const repo = new ProductosRepository();

async function getAll(req, res) {
  const productos = await repo.getAll();
  console.log(productos)
  return res.json(productos)
}

async function getAllVisible(req, res) {
  const productos = await repo.getAllActive()
  return res.json(productos)
}

async function getById(req, res) {
  const id = Number(req.params.id)
  const producto = await repo.getById(id)

  if (!producto) {
    return res.status(404).json({error: 'Producto no encontrado'})
  }

  return res.json(producto)
}

async function create(req, res) {
  const { nombre, precio } = req.body;

  if (!nombre || typeof nombre !== 'string') {
    return res.status(400).json({error: 'Nombre inválido'})
  }

  const precioNumber = Number(precio);
  if (precio <= 0) {
    return res.status(400).json({error: 'Precio inválido'})
  }

  const nuevo = await repo.create(nombre, precioNumber)
  return res.status(201).json(nuevo)
}

async function update(req, res) {
  const id = Number(req.params.id);
  const { nombre, precio } = req.body

  const payload = {
    nombre: nombre !== undefined ? nombre : undefined,
    precio: precio !== undefined ? precio : undefined
  }

  if (payload.precio !== undefined &&
    (!Number.isFinite(payload.precio) || payload.precio <= 0)
  ) {
    return res.status(400).json({error: 'precio inválido'})
  }

  const actualizado = await repo.update(id, payload)

  if (!actualizado) {
    return res.status(404).json({error: 'No encontrado'})
  }

  return res.json(actualizado)
}

async function remove(req, res) {
  const id = Number(req.params.id);
  const ok = await repo.delete(id)

  if (!ok) {
    return res.status(404).json({error: 'No encontrado'})
  }

  return res.status(204).send()
}

module.exports = { getAll, getAllVisible, getById, create, update, remove }