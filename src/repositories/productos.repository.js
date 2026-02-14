const { pool } = require('../db');

class ProductosRepository {

  async getAll() {
    const result = await pool.query(
      'select id, nombre, precio from productos;'
    );
    return result.rows;
  }

  async getAllActive() {
    const result = await pool.query(
      'select id, nombre, precio from productos where activo = true;'
    );
    return result.rows;
    // return this.productos.filter(producto => producto.active);
  }

  async getById(id) {
    const result = await pool.query(
      'select id, nombre, precio, stock, descripcion from productos where activo = true and id = $1;', [id]
    );
    return result.rows[0];
    // return this.productos.find(producto => producto.id === id);
  }

  async create(nombre, precio) {
    const result = await pool.query(
      'insert into productos (nombre, precio) values ($1,$2) returning id, nombre, precio;',[nombre, precio] 
    );
    return result.rows[0];
    // const newProducto = { id: this.nextId++, nombre, precio };
    // this.productos.push(newProducto);
    // return newProducto;
  }
  async update(id, data) {
    /*const producto = await this.getById(id);
    if (producto) {
      producto.nombre = data.nombre;
      producto.precio = data.precio;
      return producto;
    }
    return null;
    */
    const result = await pool.query(
      'UPDATE productos SET nombre = coalesce($1, nombre), precio = coalesce($2, precio) WHERE id = $3 returning id, nombre, precio',
      [data.nombre ?? null, data.precio ?? null, data.id]
    )
    return result.rows[0] || null
  }

  async delete(id) {
    /*const index = this.productos.findIndex(producto => producto.id === id);
    if (index !== -1) {
      return this.productos.splice(index, 1)[0];
    }
    return null;
    */
   const result = await pool.query(
    'DELETE FROM productos WHERE id = $1 returning id', [id]
   )

   return result.rows[0] || null
  }
}

module.exports = { ProductosRepository }